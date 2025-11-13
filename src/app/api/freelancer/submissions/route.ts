import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse session cookie
    const session = JSON.parse(sessionCookie.value)
    const freelancerEmail = session.email // 👈 use email instead of ID

    if (!freelancerEmail) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 })
    }

    // Fetch only submissions for this freelancer’s email
    const { data: submissions, error } = await supabaseAdmin
      .from("freelancer_submissions")
      .select(`
        id,
        form_id,
        created_at,
        proposal_link,
        profile_rating,
        forms:form_id (
          id,
          form_name,
          form_description,
          client_table (
            id,
            name,
            company_name
          )
        )
      `)
      .eq("email", freelancerEmail) // 👈 changed this line
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [DEBUG] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("❌ [DEBUG] Get submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
