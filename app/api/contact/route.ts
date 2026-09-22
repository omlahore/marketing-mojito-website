import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { logFormSubmission } from '@/lib/google-sheets';
import { checkRateLimit, checkTimestamp, checkHoneypots, looksLikeSpam, verifyRecaptcha } from '@/lib/spam';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

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

    const { name, company, email, phone, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Spam pattern check
    if (looksLikeSpam(body)) {
      return NextResponse.json({ success: false, error: 'Failed to send' }, { status: 400 });
    }

    // reCAPTCHA v3 - REQUIRED whenever a secret is configured. A missing token is
    // a failure, not a skip, so a direct POST that omits the field is rejected.
    if (process.env.RECAPTCHA_SECRET_KEY && !(await verifyRecaptcha(body.recaptchaToken))) {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 });
    }

    // Send email to both team members
    const { data, error } = await getResend().emails.send({
      from: 'Marketing Mojito <hello@marketingmojito.com>',
      to: ['rahul@marketingmojito.com', 'om.mojito@gmail.com'],
      subject: `New Contact Form - ${name}`,
      text: `
New Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Subject: ${subject || 'Not provided'}

Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log to Google Sheets
    await logFormSubmission({
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      formType: 'Contact',
      name,
      email,
      company,
      phone,
      subject,
      message,
      page: 'Contact Form',
      status: 'Contact inquiry sent',
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
