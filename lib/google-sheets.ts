import { google } from 'googleapis';

interface FormSubmission {
  timestamp: string;
  formType: 'Contact' | 'Lead Magnet' | 'Free Tool';
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message?: string;
  resourceName?: string;
  page: string;
  status: string;
}

export async function logFormSubmission(data: FormSubmission) {
  try {
    // Skip if no Sheet ID configured
    if (!process.env.GOOGLE_SHEET_ID) {
      console.log('⚠️  Google Sheets not configured - skipping log');
      return { success: false, reason: 'not_configured' };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Form Submissions!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.timestamp,
          data.formType,
          data.name,
          data.email,
          data.company || '',
          data.phone || '',
          data.subject || '',
          data.message || '',
          data.resourceName || '',
          data.page,
          data.status,
        ]],
      },
    });

    console.log('✅ Logged to Google Sheet:', data.formType, '-', data.name);
    return { success: true };
  } catch (error) {
    console.error('❌ Google Sheets error:', error);
    return { success: false, error };
  }
}
