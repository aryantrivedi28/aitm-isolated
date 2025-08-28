import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabase-admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[v0] Received submission data:", body)

    const {
      form_id,
      name,
      email,
      phone,
      portfolio_link,
      github_link,
      resume_link,
      years_experience,
      proposal_link,
      custom_responses,
    } = body

    // Validate required fields
    if (!form_id || !name || !email) {
      return NextResponse.json({ error: "Missing required fields: form_id, name, email" }, { status: 400 })
    }

    const { data: form, error: formError } = await supabaseAdmin
      .from("forms")
      .select("id, is_active")
      .eq("form_id", form_id)
      .single()

    if (formError || !form) {
      console.error("[v0] Form not found:", formError)
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form.is_active) {
      return NextResponse.json({ error: "Form submissions are currently closed" }, { status: 403 })
    }

    const submissionData = {
      form_id: form.id, // Use UUID from forms table
      name,
      email,
      phone: phone || null,
      portfolio_link: portfolio_link || null,
      github_link: github_link || null,
      resume_link: resume_link || null,
      years_experience: years_experience ? Number(years_experience) : null,
      proposal_link: proposal_link || null,
      custom_responses: custom_responses || {}, // Ensure custom_responses is properly saved
    }

    console.log("[v0] Inserting submission with data:", submissionData)

    const { data, error } = await supabaseAdmin
      .from("freelancer_submissions")
      .insert([submissionData])
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Successfully created submission:", data)

    return NextResponse.json({
      submission: data,
      success: true,
    })
  } catch (err: any) {
    console.error("[v0] Error creating submission:", err)
    return NextResponse.json({ error: err.message || "Failed to create submission" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get("form_id")

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("freelancer_submissions")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ submissions: data })
  } catch (err: any) {
    console.error("Error fetching submissions:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch submissions" }, { status: 500 })
  }
}
