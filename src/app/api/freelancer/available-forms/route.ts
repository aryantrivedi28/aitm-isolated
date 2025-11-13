import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"

export async function GET(request: NextRequest) {
  try {
    console.log("🟢 [DEBUG] Starting GET /api/freelancer/forms/available")

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      console.warn("⚠️ [DEBUG] No freelancer_session cookie found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (err) {
      console.error("❌ [DEBUG] Failed to parse session cookie:", err)
      return NextResponse.json({ error: "Invalid session cookie" }, { status: 400 })
    }

    const freelancerId = session?.id
    console.log("👤 [DEBUG] Freelancer ID:", freelancerId)

    if (!freelancerId) {
      return NextResponse.json({ error: "Invalid freelancer session" }, { status: 400 })
    }

    // Fetch all active forms (removed 'status' filter)
    const { data: forms, error: formsError } = await supabaseAdmin
      .from("forms")
      .select(
        `
        id,
        form_id,
        form_name,
        form_description,
        industry,
        category,
        subcategory,
        tech_stack,
        tools,
        created_at,
        client_id,
        client_table:client_id(name, company_name)
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (formsError) {
      console.error("❌ [DEBUG] Supabase forms fetch error:", formsError)
      return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
    }

    console.log(`📄 [DEBUG] Total forms fetched: ${forms?.length || 0}`)

    // Fetch freelancer's existing submissions
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from("freelancer_submissions")
      .select("form_id")
      .eq("id", freelancerId)

    if (submissionsError) {
      console.error("❌ [DEBUG] Supabase submissions fetch error:", submissionsError)
      return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
    }

    console.log(`🧾 [DEBUG] Submissions found: ${submissions?.length || 0}`)

    const submittedFormIds = submissions?.map((s) => s.form_id) || []
    console.log("🧮 [DEBUG] Submitted form IDs:", submittedFormIds)

    // Filter out forms already applied to
    const availableForms =
      forms?.filter((f) => !submittedFormIds.includes(f.id)) || []

    console.log(`✅ [DEBUG] Available forms to show: ${availableForms.length}`)

    return NextResponse.json({ forms: availableForms })
  } catch (error) {
    console.error("🔥 [DEBUG] Unexpected error in GET /forms/available:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
