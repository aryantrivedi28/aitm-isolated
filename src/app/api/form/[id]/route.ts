import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase-admin"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🟢 [DEBUG] Starting GET /api/form/[id]")

    const { id: formId } = await context.params
    console.log("📄 [DEBUG] Form ID from URL:", formId)

    if (!formId) {
      return NextResponse.json({ error: "Missing form ID" }, { status: 400 })
    }

    const { data: form, error: formError } = await supabaseAdmin
      .from("forms")
      .select(`
        id,
        form_id,
        form_name,
        form_description,
        industry,
        category,
        subcategory,
        tech_stack,
        tools,
        is_active,
        created_at,
        required_fields,
        custom_questions,
        message,
        client_id,
        client_table:client_id(
          id,
          name,
          company_name
        )
      `)
      .eq("id", formId)
      .single()

    if (formError) {
      console.error("❌ [DEBUG] Supabase fetch error:", formError)
      if (formError.code === "PGRST116") {
        return NextResponse.json({ error: "Form not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!form) {
      console.warn("⚠️ [DEBUG] No form found for ID:", formId)
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    console.log("✅ [DEBUG] Form fetched successfully:", form.form_name)
    return NextResponse.json({ form })
  } catch (error) {
    console.error("🔥 [DEBUG] Unexpected error in GET /api/form/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
