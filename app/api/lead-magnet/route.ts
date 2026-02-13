import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import path from 'path';
import fs from 'fs';
import { logFormSubmission } from '@/lib/google-sheets';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { name, email, pdfName, pageName, tool_link } = body;

    // Validation
    if (!name || !email || !pdfName || !pageName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const toolLinkSection = tool_link
      ? `Direct PDF Link: ${tool_link}\n\n`
      : '';

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
    const { data: teamData, error: teamError } = await resend.emails.send({
      from: 'Marketing Mojito <hello@marketingmojito.com>',
      to: ['om.mojito@gmail.com'],
      subject: `Lead Magnet Request - ${pdfName}`,
      text: `
New Lead Magnet Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Resource Requested: ${pdfName}
Page: ${pageName}

${toolLinkSection}Contact Details:
Name: ${name}
Email: ${email}

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
    const resourceMessage = docxAttached
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
          <a href="https://marketingmojito.com/free-tools-and-template" 
             style="display: inline-block; background: white; color: #82C341; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Explore All Free Tools
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
    const { error } = await resend.emails.send({
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
