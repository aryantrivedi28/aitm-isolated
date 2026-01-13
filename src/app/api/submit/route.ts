import { supabaseAdmin } from '../../../lib/supabase-admin'
import { sendAdminEmail, sendConfirmationEmail } from '../../../lib/email'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    // 1️⃣ Parse body
    const body = await request.json()

    const {
      formId,
      formName,
      formType,
      pageSlug,
      data,
    } = body

    // 2️⃣ Basic validation (ONLY common identity fields)
    if (!data?.name || !data?.email || !data?.phone) {
      return Response.json(
        { error: 'Missing required fields (name, email, phone)' },
        { status: 400 }
      )
    }

    // 3️⃣ Read headers (metadata)
    const headersList = await headers()
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0] || 'Unknown'
    const userAgent = headersList.get('user-agent') || 'Unknown'

    // 4️⃣ Build DB payload
    const submission = {
      form_id: formId,
      form_name: formName,
      form_type: formType,
      page_slug: pageSlug,

      name: data.name,
      email: data.email,
      phone: data.phone,

      payload: data, // 🔥 ALL dynamic fields here
      ip_address: ip,
      user_agent: userAgent,
      status: 'new',
    }

    // 5️⃣ Insert into Supabase
    const { data: saved, error } = await supabaseAdmin
      .from('form_submissions')
      .insert([submission])
      .select()
      .single()

    if (error) {
      console.error('[FORM API] Supabase error:', error)
      return Response.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    // 6️⃣ Emails (non-blocking)
    try {
      await sendAdminEmail({
        formName,
        formType,
        pageSlug,
        ...data,
        ip,
        userAgent,
      })

      await sendConfirmationEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
      })
    } catch (emailError) {
      console.error('[FORM API] Email error:', emailError)
    }

    // 7️⃣ Success response
    return Response.json({
      success: true,
      message: 'Form submitted successfully',
      id: saved.id,
    })
  } catch (error) {
    console.error('[FORM API] Fatal error:', error)

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
