import { NextResponse } from 'next/server';

/** Returns public config (e.g. reCAPTCHA site key for forms). */
export async function GET() {
  return NextResponse.json({
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  });
}
