"use server"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"
import { cookies } from "next/headers"
import { sendEmail } from "../../../../lib/mailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { role_type, job_title, description, budget_range, category, subcategory, tools } = body

    if (!category?.length || !subcategory?.length || !tools?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (category, subcategory, or tools)" },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("client_auth")

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let client_id: string
    try {
      const session = JSON.parse(sessionCookie.value)
      client_id = session.id
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 })
    }

    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("client_table")
      .select("*")
      .eq("id", client_id)
      .single()

    if (clientError || !clientData)
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 })

    const { data: hiringData, error: hiringError } = await supabaseAdmin
      .from("hiring_requests")
      .insert([
        {
          client_id,
          role_type,
          job_title,
          description,
          budget_range,
          category,
          subcategory,
          tools,
        },
      ])
      .select("*")
      .single()

    if (hiringError) throw hiringError

    const form_id = `${subcategory[0]?.toLowerCase()}-${tools[0]?.toLowerCase()}-${Date.now().toString().slice(-4)}`
    const form_name = `${subcategory[0]} Freelancer Form`
    const form_description =
      description ||
      `We are seeking ${subcategory[0]} freelancers skilled in ${tools.join(", ")} for ${clientData.industry} projects.`
    const message = "Please fill out the details below to apply."

    const { data: formData, error: formError } = await supabaseAdmin
      .from("forms")
      .insert([
        {
          form_id,
          form_name,
          form_description,
          industry: clientData.industry,
          category: category[0],
          subcategory: subcategory[0],
          tech_stack: tools,
          message,
          created_by: client_id,
          is_active: false,
          status: "pending_review",
          auto_generated: true,
        },
      ])
      .select("*")
      .single()

    if (formError) throw formError

    try {
      const adminEmailHtml = `
        <h2>New Client Hiring Submission</h2>
        <p><strong>Client:</strong> ${clientData.name} (${clientData.email})</p>
        <p><strong>Form:</strong> ${form_name}</p>
        <p><strong>Category:</strong> ${category.join(", ")}</p>
        <p><strong>Subcategory:</strong> ${subcategory.join(", ")}</p>
        <p><strong>Tools:</strong> ${tools.join(", ")}</p>
        <p><strong>Status:</strong> Pending Review</p>
      `
      await sendEmail(process.env.SMTP_USER!, "New Client Form Submission", adminEmailHtml)
    } catch (err) {
      console.error("Failed to send admin email:", err)
    }

    try {
      const clientEmailHtml = `
        <p>Dear ${clientData.name},</p>
        <p>Your hiring request has been received. Our team will review your requirements and get in touch shortly.</p>
        <p>Form ID: ${form_id}</p>
        <p>Best regards,<br/>The Finzie Team</p>
      `
      await sendEmail(clientData.email, "Hiring Request Received", clientEmailHtml)
    } catch (err) {
      console.error("Failed to send client confirmation email:", err)
    }

    return NextResponse.json({ success: true, hiring: hiringData, form: formData })
  } catch (err: any) {
    console.error("Error in client hiring route:", err)
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
