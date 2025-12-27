import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/SupabaseAuthClient';
import { syncToGoogleSheets } from '../../../lib/googleSheetSync';
import { sendAdminEmail } from '@/src/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, email, phone, company, requirement } = req.body;

    // 1. Save to Supabase (you definitely have access to this)
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

    if (insertError) throw insertError;

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

    return res.status(200).json({
      success: true,
      message: 'Request submitted and processed',
      data: inserted
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}