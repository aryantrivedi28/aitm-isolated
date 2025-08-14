import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabase-admin"
import type { CreateSubmissionData } from "../../../types/database"

export async function POST(req: Request) {
  try {
    const body: CreateSubmissionData = await req.json()
    const { form_id, name, email, phone, portfolio_link, github_link, resume_link, years_experience, proposal_link } =
      body

    // Validate required fields
    if (!form_id || !name || !email) {
      return NextResponse.json({ error: "Missing required fields: form_id, name, email" }, { status: 400 })
    }

    // Verify that the form exists
    const { data: formData, error: formError } = await supabaseAdmin
      .from("forms")
      .select("id, form_name")
      .eq("id", form_id)
      .single()

    if (formError || !formData) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Insert submission into database
    const { data, error } = await supabaseAdmin
      .from("freelancer_submissions")
      .insert([
        {
          form_id,
          name,
          email,
          phone: phone || null,
          portfolio_link: portfolio_link || null,
          github_link: github_link || null,
          resume_link: resume_link || null,
          years_experience: years_experience || null,
          proposal_link: proposal_link || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      submission: data,
      success: true,
      message: "Application submitted successfully!",
    })
  } catch (err: any) {
    console.error("Error creating submission:", err)
    return NextResponse.json({ error: err.message || "Failed to submit application" }, { status: 500 })
  }
}

// GET endpoint to fetch submissions for a specific form (admin use)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const form_id = searchParams.get("form_id")

    if (!form_id) {
      return NextResponse.json({ error: "form_id parameter is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("freelancer_submissions")
      .select("*")
      .eq("form_id", form_id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ submissions: data })
  } catch (err: any) {
    console.error("Error fetching submissions:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch submissions" }, { status: 500 })
  }
}
