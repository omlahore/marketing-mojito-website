/**
 * Spam protection for form submissions
 */

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max submissions per IP per hour
const MIN_SUBMIT_DELAY_MS = 2000; // form must be visible at least 2 sec before submit
const MAX_SUBMIT_DELAY_MS = 24 * 60 * 60 * 1000; // max 24 hours (prevent replay)

// In-memory rate limit (resets on server restart - acceptable for single instance)
const ipCounts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  // Nginx sets X-Real-IP from $remote_addr, which the client cannot forge.
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();

  // X-Forwarded-For is built with $proxy_add_x_forwarded_for, i.e. whatever the
  // client sent plus our proxy's view appended. Only the LAST entry is trusted;
  // reading the first lets a bot mint a fresh rate-limit bucket per request.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    return parts[parts.length - 1].trim();
  }
  return 'unknown';
}

export function checkRateLimit(request: Request): boolean {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export function checkTimestamp(body: Record<string, unknown>): boolean {
  const loaded = body._loaded;
  if (typeof loaded !== 'number') return false;

  const now = Date.now();
  const elapsed = now - loaded;

  if (elapsed < MIN_SUBMIT_DELAY_MS) return false; // too fast - bot
  if (elapsed > MAX_SUBMIT_DELAY_MS) return false; // too old - replay
  return true;
}

export function checkHoneypots(body: Record<string, unknown>): boolean {
  // Reject if any honeypot is filled
  const honeypots = ['website', 'company_url', 'url'];
  for (const field of honeypots) {
    const val = body[field];
    if (val && String(val).trim().length > 0) return false;
  }
  return true;
}

/** Verify reCAPTCHA v3 token with Google. Returns true if valid (score >= 0.3). */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return false;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      'error-codes'?: string[];
    };

    // A bad secret or unregistered domain rejects every real visitor silently,
    // now that a failed verification blocks the submission. Log it loudly so it
    // shows up in `pm2 logs` instead of quietly killing the funnel.
    const codes = data['error-codes'] || [];
    if (codes.includes('invalid-input-secret') || codes.includes('invalid-keys')) {
      console.error('RECAPTCHA MISCONFIGURED - all form submissions are being rejected:', codes);
    }

    return Boolean(data.success && (data.score ?? 0) >= 0.3);
  } catch {
    return false;
  }
}

/** Basic spam pattern check - obvious bot patterns only */
export function looksLikeSpam(body: Record<string, unknown>): boolean {
  const msg = String(body.message || '').toLowerCase();
  const email = String(body.email || '').toLowerCase();

  // Link-only or link-heavy short messages (common spam)
  if (msg.includes('http') && msg.length < 60) return true;

  // Disposable/temp email domains (common in spam)
  const disposableDomains = [
    'tempmail', 'throwaway', 'guerrillamail', '10minutemail',
    'mailinator', 'yopmail', 'trashmail', 'fakeinbox', 'getnada'
  ];
  if (disposableDomains.some(d => email.includes(d))) return true;

  return false;
}
