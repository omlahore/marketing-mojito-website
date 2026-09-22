'use client';

/**
 * Client-side reCAPTCHA v3 token fetch, shared by the React lead forms.
 * Mirrors public/js/forms.js, which covers the static Webflow-markup forms.
 *
 * The site key is read from /api/config at runtime rather than the inlined
 * NEXT_PUBLIC_ value, so a build that ran without the env var can't silently
 * ship token-less forms that the server would then reject.
 *
 * Returns '' when the key is unset or Google's script is blocked. The server
 * treats an empty token as a failed verification.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void;
      execute(siteKey: string, opts: { action: string }): Promise<string>;
    };
  }
}

let siteKeyPromise: Promise<string> | null = null;
let scriptPromise: Promise<void> | null = null;

function getSiteKey(): Promise<string> {
  siteKeyPromise ??= fetch('/api/config')
    .then((r) => r.json())
    .then((d: { recaptchaSiteKey?: string }) => d.recaptchaSiteKey || '')
    .catch(() => '');
  return siteKeyPromise;
}

function loadScript(siteKey: string): Promise<void> {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('reCAPTCHA script blocked'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export async function getRecaptchaToken(action: string): Promise<string> {
  try {
    const siteKey = await getSiteKey();
    if (!siteKey) return '';
    await loadScript(siteKey);
    const g = window.grecaptcha;
    if (!g) return '';
    await new Promise<void>((resolve) => g.ready(resolve));
    return await g.execute(siteKey, { action });
  } catch {
    return '';
  }
}
