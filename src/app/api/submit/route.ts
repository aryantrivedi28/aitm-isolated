import { supabaseAdmin } from '../../../lib/supabase-admin'
import { sendAdminEmail, sendConfirmationEmail } from '../../../lib/email'
import { headers } from 'next/headers'

export async function POST(request: Request) {

  try {
    // 1️⃣ Parse request body
    const formData = await request.json()

    // 2️⃣ Read headers
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'Unknown'
    const userAgent = headersList.get('user-agent') || 'Unknown'


    // 3️⃣ Build submission payload
    const submissionData = {
      ...formData,
      ip_address: ip,
      user_agent: userAgent,
      submitted_at: new Date().toISOString(),
      status: 'new'
    }

    // 4️⃣ Validate required fields
    if (
      !submissionData.name ||
      !submissionData.email ||
      !submissionData.phone ||
      !submissionData.interest
    ) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert([submissionData])
      .select()

    if (error) {
      console.error('[CONTACT API] Supabase error:', error)
      throw error
    }

    // 6️⃣ Send emails (non-blocking failures)
    try {
      await sendAdminEmail({
        ...formData,
        ip,
        userAgent
      })
      await sendConfirmationEmail(formData)

    } catch (emailError) {
      console.error('[CONTACT API] Email error:', emailError)
      // Do not fail request on email error
    }


    return Response.json({
      success: true,
      message: 'Form submitted successfully',
      data: data[0]
    })

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return Response.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}
