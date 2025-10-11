import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import csv from 'csv-parser';
import fetch from 'node-fetch';
import { Readable } from 'stream';

export const runtime = 'nodejs';

type Freelancer = { email: string; [key: string]: string };
type Result = {
  totalRows: number;
  attempted: number;
  sent: number;
  failed: { email: string; error: string }[];
};

// 🔧 Helper — reads CSV text into array
async function parseCsvFromText(csvText: string): Promise<Freelancer[]> {
  console.log('🔍 [DEBUG] Starting CSV parsing...');
  return new Promise((resolve, reject) => {
    const rows: Freelancer[] = [];
    const stream = Readable.from(csvText);

    stream
      .pipe(csv())
      .on('data', (row) => {
        // Normalize all keys to lowercase and trim whitespace
        const normalizedRow: any = {};
        for (const key in row) {
          normalizedRow[key.trim().toLowerCase()] = row[key]?.trim();
        }
        console.log('📄 [DEBUG] Row parsed (normalized):', normalizedRow);
        rows.push(normalizedRow);
      })
      .on('end', () => {
        console.log(`✅ [DEBUG] CSV parsing complete. Total rows: ${rows.length}`);
        resolve(rows);
      })
      .on('error', (err) => {
        console.error('❌ [DEBUG] CSV parsing failed:', err);
        reject(err);
      });
  });
}


// 🔧 Helper — convert Google Sheet link → CSV export link
function getExportCsvUrl(sheetUrl: string): string {
  console.log('🔍 [DEBUG] Processing Google Sheet URL:', sheetUrl);
  if (sheetUrl.includes('/export?format=csv')) {
    console.log('✅ [DEBUG] Already a CSV export URL.');
    return sheetUrl;
  }
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = match?.[1];
  const exportUrl = sheetId
    ? `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
    : sheetUrl;
  console.log('🔁 [DEBUG] Converted Sheet URL to export URL:', exportUrl);
  return exportUrl;
}

// 🔧 Helper — SMTP transporter
function createTransporter() {
  console.log('🔧 [DEBUG] Creating SMTP transporter...');
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials are missing in .env');
  }

  console.log('✅ [DEBUG] SMTP Config:', {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_SECURE,
  });

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// 🚀 Main API Route
export async function POST(req: Request) {
  console.log('🚀 [DEBUG] Bulk email API called...');
  try {
    const formData = await req.formData();
    console.log('📦 [DEBUG] Form data received.');

    const file = formData.get('file') as File | null;
    const sheetUrl = formData.get('sheetUrl') as string | null;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const dryRun = formData.get('dryRun') === '1';

    console.log('📨 [DEBUG] Request Details:', {
      hasFile: !!file,
      hasSheetUrl: !!sheetUrl,
      subject,
      messageLength: message?.length,
      dryRun,
    });

    if (!file && !sheetUrl) {
      console.error('❌ [DEBUG] No CSV or Sheet URL provided.');
      return NextResponse.json({ error: 'No CSV file or Google Sheet URL provided' }, { status: 400 });
    }

    // 🧩 1. Load CSV data
    console.log('🧩 [DEBUG] Loading CSV data...');
    let csvText = '';
    if (file) {
      console.log('📁 [DEBUG] Reading uploaded file...');
      csvText = await file.text();
    } else if (sheetUrl) {
      const exportUrl = getExportCsvUrl(sheetUrl);
      console.log('🌐 [DEBUG] Fetching Google Sheet CSV from:', exportUrl);
      const res = await fetch(exportUrl);
      console.log('📡 [DEBUG] Fetch status:', res.status);
      if (!res.ok) throw new Error(`Failed to fetch Google Sheet (${res.status})`);
      csvText = await res.text();
    }

    console.log('🧾 [DEBUG] CSV text length:', csvText.length);

    const rows = await parseCsvFromText(csvText);
    if (!rows.length) {
      console.error('❌ [DEBUG] No rows found in CSV.');
      return NextResponse.json({ error: 'No rows found in CSV' }, { status: 400 });
    }

    console.log(`✅ [DEBUG] Parsed ${rows.length} total rows.`);
    const validRows = rows.filter((r) => !!r.email && /\S+@\S+\.\S+/.test(r.email));
    console.log(`📧 [DEBUG] Valid email rows: ${validRows.length}`);

    const result: Result = { totalRows: rows.length, attempted: validRows.length, sent: 0, failed: [] };

    if (dryRun) {
      console.log('🧪 [DEBUG] Dry run mode — no emails will be sent.');
      return NextResponse.json({ ...result, message: 'Dry run only — no emails sent' });
    }

    // 🧩 2. Setup mailer
    console.log('📬 [DEBUG] Setting up mail transporter...');
    const transporter = createTransporter();

    // 🧩 3. Send emails
    console.log('🚀 [DEBUG] Sending emails now...');
    for (const row of validRows) {
      console.log(`📤 [DEBUG] Sending email to: ${row.email}`);
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: row.email,
          subject,
          text: message,
        });
        console.log(`✅ [DEBUG] Email sent to: ${row.email}`);
        result.sent++;
      } catch (err: any) {
        console.error(`❌ [DEBUG] Failed to send email to ${row.email}:`, err?.message || err);
        result.failed.push({ email: row.email, error: err?.message || 'Unknown error' });
      }
    }

    console.log('🏁 [DEBUG] Email sending completed. Result:', result);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('🔥 [DEBUG] Send-bulk API Error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
