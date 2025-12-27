import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/SupabaseAuthClient';
import { syncToGoogleSheets } from '../../../lib/googleSheetSync';
import { sendAdminEmail } from '../../../lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, requirement } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !requirement) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const { data: inserted, error: insertError } = await supabase
      .from('client_requests')
      .insert([{
        full_name: fullName,
        email,
        phone,
        company: company || '',
        requirement,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase error:', insertError);
      throw insertError;
    }

    // 2. Sync to Google Sheets (server-side)
    await syncToGoogleSheets({
      timestamp: new Date().toISOString(),
      fullName,
      email,
      phone,
      company: company || 'N/A',
      requirement,
      status: 'pending'
    });

    // 3. Send email notification
    await sendAdminEmail({
      fullName,
      email,
      phone,
      company: company || 'N/A',
      requirement,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Request submitted and processed',
      data: inserted
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add other methods if needed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}