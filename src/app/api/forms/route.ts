import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabase-admin"
import type { CreateFormData }  from "../../../types/database"

export async function POST(req: Request) {
  try {
    const body: CreateFormData = await req.json()
const { form_id, form_name, category, subcategory, industry, created_by, is_active } = body

    // Validate required fields
    if (!form_id || !form_name || !category || !subcategory || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: form_id, form_name, category, subcategory, industry" },
        { status: 400 },
      )
    }

    const formIdRegex = /^[a-zA-Z0-9]+$/
    if (!formIdRegex.test(form_id)) {
      return NextResponse.json(
        { error: "Form ID must contain only letters and numbers (e.g., reactjs1, nodejs2)" },
        { status: 400 },
      )
    }

    const { data: existingForm } = await supabaseAdmin.from("forms").select("form_id").eq("form_id", form_id).single()

    if (existingForm) {
      return NextResponse.json({ error: "Form ID already exists. Please choose a different ID." }, { status: 409 })
    }

    const { data, error } = await supabaseAdmin
      .from("forms")
      .insert([
        {
          form_id,
          form_name,
          category,
          subcategory,
          industry,
          created_by: created_by || "admin",
          is_active: is_active ?? true, // 👈 respect provided value, fallback true
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    // Generate the public form URL using custom form_id
    const baseUrl =
      process.env.APP_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const publicUrl = `${baseUrl}/form/${data.form_id}`

    return NextResponse.json({
      form: data,
      url: publicUrl,
      success: true,
    })
  } catch (err: any) {
    console.error("Error creating form:", err)
    return NextResponse.json({ error: err.message || "Failed to create form" }, { status: 500 })
  }
}

// GET endpoint to list all forms (for admin dashboard)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("forms").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ forms: data })
  } catch (err: any) {
    console.error("Error fetching forms:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch forms" }, { status: 500 })
  }
}
