import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import path from 'path';
import fs from 'fs';
import { logFormSubmission } from '@/lib/google-sheets';
import { checkRateLimit, checkTimestamp, checkHoneypots, looksLikeSpam, verifyRecaptcha } from '@/lib/spam';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/** Escape text for safe embedding inside HTML emails. */
function escHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * URL-only website audit. Fetches the page server-side and scores real,
 * URL-derivable signals (HTTPS, title, meta description, viewport, H1, Open
 * Graph, favicon, response time, page weight). Returns a plain-text report.
 * SSRF-guarded: http/https only, no localhost / private ranges.
 */
async function auditWebsite(rawUrl: string): Promise<string> {
  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;

  let u: URL;
  try {
    u = new URL(normalized);
  } catch {
    return `We couldn't read the URL "${rawUrl}". Please reply with a valid website address and we'll run the audit.`;
  }
  const host = u.hostname.toLowerCase();
  if (
    u.protocol !== 'http:' && u.protocol !== 'https:' ||
    host === 'localhost' ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
    host === '::1'
  ) {
    return `The URL "${rawUrl}" can't be audited automatically. Reply to this email and our team will review it manually.`;
  }

  try {
    const t0 = Date.now();
    const res = await fetch(u.toString(), {
      redirect: 'follow',
      headers: { 'User-Agent': 'MarketingMojitoAuditBot/1.0 (+https://marketingmojito.com)' },
      signal: AbortSignal.timeout(9000),
    });
    const ms = Date.now() - t0;
    const html = (await res.text()).slice(0, 600000);
    const sizeKb = Math.round(Buffer.byteLength(html) / 1024);

    const checks: { label: string; ok: boolean; weight: number; fix: string }[] = [
      { label: 'Secure (HTTPS)', ok: u.protocol === 'https:', weight: 12, fix: 'Install an SSL certificate — browsers and Google flag non-HTTPS sites.' },
      { label: 'Loads reasonably fast', ok: ms < 2500, weight: 16, fix: `Initial response took ${ms}ms. Compress assets, enable caching, and cut unused scripts.` },
      { label: 'Page weight is lean', ok: sizeKb < 200, weight: 8, fix: `The HTML is ~${sizeKb}KB. Trim inline bloat and lazy-load heavy media.` },
      { label: 'Has a page title', ok: /<title[^>]*>([^<]{3,})<\/title>/i.test(html), weight: 14, fix: 'Add a unique, descriptive <title> — it is the single biggest on-page SEO signal.' },
      { label: 'Has a meta description', ok: /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{10,}/i.test(html), weight: 12, fix: 'Add a 120–160 char meta description to improve click-through from search.' },
      { label: 'Mobile viewport set', ok: /<meta[^>]+name=["']viewport["']/i.test(html), weight: 14, fix: 'Add a viewport meta tag so the site renders correctly on phones.' },
      { label: 'Has an H1 heading', ok: /<h1[\s>]/i.test(html), weight: 8, fix: 'Add a single clear <h1> describing the page for users and search engines.' },
      { label: 'Social share tags (Open Graph)', ok: /<meta[^>]+property=["']og:/i.test(html), weight: 8, fix: 'Add Open Graph tags so shared links show a proper title and image.' },
      { label: 'Favicon present', ok: /<link[^>]+rel=["'][^"']*icon/i.test(html), weight: 4, fix: 'Add a favicon for a polished, trustworthy browser tab.' },
      { label: 'Analytics installed', ok: /(googletagmanager|gtag\(|G-[A-Z0-9]{6,}|analytics\.js)/i.test(html), weight: 4, fix: 'Install GA4 and track lead events — you cannot improve what you do not measure.' },
    ];

    const total = checks.reduce((a, c) => a + c.weight, 0);
    const got = checks.reduce((a, c) => a + (c.ok ? c.weight : 0), 0);
    const score = Math.round((got / total) * 100);
    const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F';
    const passed = checks.filter((c) => c.ok);
    const failed = checks.filter((c) => !c.ok);

    const lines: string[] = [];
    lines.push(`Website Health Report for ${u.hostname}`);
    lines.push(`Audited: ${u.toString()}`);
    lines.push('');
    lines.push(`OVERALL SCORE: ${score}/100  (Grade ${grade})`);
    lines.push(`Initial load: ${ms}ms   Page weight: ~${sizeKb}KB`);
    lines.push('');
    if (failed.length) {
      lines.push(`WHAT TO FIX (${failed.length}):`);
      failed.forEach((c, i) => lines.push(`  ${i + 1}. ${c.label} — ${c.fix}`));
      lines.push('');
    }
    if (passed.length) {
      lines.push(`PASSING (${passed.length}): ${passed.map((c) => c.label).join(', ')}`);
      lines.push('');
    }
    lines.push('Want us to fix these for you? Book a free 15-min call: https://marketingmojito.com/contact-us');
    return lines.join('\n');
  } catch {
    return `We tried to audit "${u.hostname}" but couldn't reach it automatically (it may block bots or be temporarily down). Reply to this email and our team will run a manual review for you.`;
  }
}

// Map resource names to DOCX filenames (18 unique DOCX files for 19 pages)
const RESOURCE_MAP: Record<string, string> = {
  // Homepage & Partner page - same file
  'Self-Audit Checklist': 'Marketing_Self_Audit_Checklist by Marketing Mojito.docx',
  'Business Growth Toolkit': 'Marketing_Self_Audit_Checklist by Marketing Mojito.docx',

  // Website & E-commerce page
  'Website Conversion Audit': 'Free Website Conversion Audit Template by Marketing Mojito.docx',

  // AI & Automation page
  'Workflow Playbook': 'Free Workflow Playbook_ How Can You Automate Marketing by Marketing Mojito.docx',

  // Branding page
  'Brand Identity Scorecard': 'Free Brand Identity Scorecard by Marketing Mojito.docx',

  // Motion & Animation page
  '30 Animated Videos': '30 Essential Animated Videos for SaaS Startups by Marketing Mojito.docx',

  // Photography & Video page
  'Shoot Planner': 'Free Shoot Planner Template By Marketing Mojito.docx',

  // Paid Advertising page
  'Ad Metrics Dashboard': 'Free Ad Metrics Dashboard by Marketing Mojito.docx',

  // SEO page
  'SEO Audit Template': 'Free SEO Audit Template by Marketing Mojito.docx',

  // Performance Analytics page
  'Funnel Optimization Checklist': 'Free Funnel Optimization Checklist by Marketing Mojito.docx',

  // Social Media Strategy page
  'Instagram Bio Guide': 'Free Instagram Bio & Highlights Guide by Marketing Mojito.docx',

  // Personal Branding page
  'LinkedIn Optimization Guide': 'Free LinkedIn Profile Optimization Guide by Marketing Mojito.docx',

  // Viral Content page
  'Viral Reels Templates': 'Free Viral Reels Script & Hook Templates by Marketing Mojito.docx',

  // E-Commerce Industry page
  'Product Launch Checklist': 'Free Product Launch Checklist for D2C Brands by Marketing Mojito.docx',

  // Healthcare Industry page
  'Appointment Tracker': 'Free Appointment Tracker for Clinics by Marketing Mojito.docx',

  // Real Estate Industry page
  'Sales Funnel Template': 'Free Real Estate Sales Funnel Template by Marketing Mojito.docx',

  // SaaS Industry page
  'SaaS Metrics Dashboard': 'Free SaaS Metrics Dashboard by Marketing Mojito.docx',

  // Hospitality Industry page
  'Room Booking Checklist': 'Free Room Booking Checklist by Marketing Mojito.docx',

  // Entertainment Industry page
  'Launch Plan Checklist': 'Free Launch Plan Checklist by Marketing Mojito.docx',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Rate limit - 3 per IP per hour
    if (!checkRateLimit(request)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    // Timestamp - form must be visible 4+ sec before submit (blocks bots)
    if (!checkTimestamp(body)) {
      return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 400 });
    }

    // Honeypots - reject if any filled
    if (!checkHoneypots(body)) {
      return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 400 });
    }

    const { name, email, company, pdfName, pageName, tool_link, auditUrl } = body;
    let resultDetails: string | undefined =
      typeof body.resultDetails === 'string' ? body.resultDetails : undefined;

    // Validation
    if (!name || !email || !pdfName || !pageName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Spam pattern check (disposable emails etc)
    if (looksLikeSpam(body)) {
      return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 400 });
    }

    // reCAPTCHA v3 - REQUIRED whenever a secret is configured. A missing token is
    // a failure, not a skip: bots POST straight to this route and simply omit the
    // field, which is how the fake lead-magnet submissions were getting through.
    if (process.env.RECAPTCHA_SECRET_KEY && !(await verifyRecaptcha(body.recaptchaToken))) {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 });
    }

    // URL-only website audit: compute the report server-side so no score is
    // ever exposed to the client — the result exists only in the email.
    if (typeof auditUrl === 'string' && auditUrl.trim()) {
      resultDetails = await auditWebsite(auditUrl);
    }

    const toolLinkSection = tool_link
      ? `Direct PDF Link: ${tool_link}\n\n`
      : '';
    const resultTextSection = resultDetails ? `Result delivered to lead:\n${resultDetails}\n\n` : '';

    // Resolve DOCX filename and load file for user email attachment
    const docxFilename = RESOURCE_MAP[pdfName];
    const attachments: { filename: string; content: Buffer }[] = [];
    let docxAttached = false;
    if (docxFilename) {
      const docxPath = path.join(process.cwd(), 'public', 'resources', docxFilename);
      try {
        const fileBuffer = await fs.promises.readFile(docxPath);
        attachments.push({ filename: docxFilename, content: fileBuffer });
        docxAttached = true;
      } catch (err) {
        console.warn(`DOCX not found for "${pdfName}": ${docxPath}`, err);
      }
    }

    const actionRequired = docxAttached
      ? 'DOCX was attached to user email.'
      : `⚠️ MANUAL SEND: Add "${docxFilename || pdfName}" to public/resources/ and send to ${email}`;

    // Send notification to team
    const { data: teamData, error: teamError } = await getResend().emails.send({
      from: 'Marketing Mojito <hello@marketingmojito.com>',
      to: ['rahul@marketingmojito.com', 'om.mojito@gmail.com'],
      subject: `Lead Magnet Request - ${pdfName}`,
      text: `
New Lead Magnet Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Resource Requested: ${pdfName}
Page: ${pageName}

${toolLinkSection}${resultTextSection}Contact Details:
Name: ${name}
Email: ${email}
${typeof company === 'string' && company.trim() ? `Company: ${company.trim()}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action Required: ${actionRequired}
Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
    });

    if (teamError) {
      console.error('Resend team notification error:', teamError);
      return NextResponse.json(
        { success: false, error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    // Prepare user email with HTML formatting
    const resultBlock = resultDetails
      ? `<div style="background:#f7fbf3;border:1px solid #d9ecc6;border-radius:8px;padding:20px;margin:20px 0;">
           <pre style="white-space:pre-wrap;word-wrap:break-word;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.55;color:#333;margin:0;">${escHtml(resultDetails)}</pre>
         </div>`
      : '';

    const resourceMessage = resultDetails
      ? `<p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 8px;">
           Here's the result you requested:
         </p>${resultBlock}`
      : docxAttached
      ? `<p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
           Your requested resource is attached to this email. You can open it with Microsoft Word or Google Docs.
         </p>`
      : tool_link
        ? `<p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
             You can download your resource here: <a href="${tool_link}" style="color: #82C341; text-decoration: none; font-weight: 600;">${tool_link}</a>
           </p>`
        : `<p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
             Our team will send you the resource shortly at this email address.
           </p>`;

    const userEmailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://marketingmojito.com/images/MM-1.png" alt="Marketing Mojito" style="max-width: 180px; height: auto;" />
      </div>

      <div style="background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        
        <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${(name.split(' ')[0] || name)},</p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
          Thank you for downloading <strong>"${pdfName}"</strong>!
        </p>

        ${resourceMessage}

        <div style="background: linear-gradient(135deg, #82C341 0%, #6BA534 100%); border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
          <p style="color: white; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
            🎯 Want More Free Resources?
          </p>
          <a href="https://marketingmojito.com/free-templates" 
             style="display: inline-block; background: white; color: #82C341; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Explore Free Templates
          </a>
        </div>

        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 10px;">
          Have questions? We're here to help!
        </p>

        <p style="font-size: 16px; color: #333; margin-bottom: 5px;">
          Best regards,<br>
          <strong>Marketing Mojito Team</strong>
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
        <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
          Marketing Mojito | 
          <a href="https://marketingmojito.com" style="color: #82C341; text-decoration: none;">marketingmojito.com</a>
        </p>
      </div>

    </div>
    `;

    // Send confirmation to user (best-effort - team notification is the critical part)
    const { error } = await getResend().emails.send({
      from: 'Marketing Mojito <hello@marketingmojito.com>',
      to: [email],
      subject: `Your ${pdfName} is ready!`,
      html: userEmailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend user confirmation error (team was notified):', error);
      // Don't fail - team got the lead, they can manually email the user
    }

    // Log to Google Sheets
    await logFormSubmission({
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      formType: tool_link ? 'Free Tool' : 'Lead Magnet',
      name,
      email,
      company: typeof company === 'string' ? company.trim() : '',
      resourceName: pdfName,
      page: pageName,
      status: docxAttached
        ? 'DOCX attachment sent'
        : tool_link
          ? 'PDF link sent'
          : 'Manual send required',
    });

    return NextResponse.json({ success: true, data: teamData });
  } catch (error) {
    console.error('Lead magnet error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
