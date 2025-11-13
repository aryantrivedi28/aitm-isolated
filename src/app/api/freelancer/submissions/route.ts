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

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id

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
      .eq("freelancer_id", freelancerId)
      .order("created_at", { ascending: false })


    console.log("🟢 [DEBUG] Fetched submissions for freelancer ID:", freelancerId)
    console.log("📄 [DEBUG] Submissions data:", submissions)
    if (error) {
      console.error("❌ [DEBUG] Supabase error:", error)
    }


    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
