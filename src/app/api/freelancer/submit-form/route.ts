import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id
    const { formId, answers } = await request.json()

    if (!formId || !answers) {
      return NextResponse.json({ error: "Form ID and answers are required" }, { status: 400 })
    }

    // Create submission
    const { data: submission, error } = await supabase
      .from("freelancer_submissions")
      .insert({
        freelancer_id: freelancerId,
        form_id: formId,
        answers,
        status: "new",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Submission error:", error)
      return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      submission,
    })
  } catch (error) {
    console.error("Submit form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
