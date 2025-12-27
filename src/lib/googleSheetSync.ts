import { google } from 'googleapis';

export async function syncToGoogleSheets(data: any) {
  try {
    // Use environment variables from your Next.js app
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.timestamp,
          data.fullName,
          data.email,
          data.phone,
          data.company,
          data.requirement,
          data.status
        ]]
      },
    });

    console.log('✅ Synced to Google Sheets');
    return true;
  } catch (error) {
    console.error('Google Sheets error:', error);
    // Don't fail the whole request if Sheets fails
    return false;
  }
}