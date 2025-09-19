import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabase-admin"
import type { CreateFormData } from "../../../types/database"




export async function POST(req: Request) {
  try {
    const body: CreateFormData = await req.json();
    console.log("Received form data:", body);
    const {
      form_id,
      form_name,
      form_description,
      industry,
      created_by,
      is_active,
      message,        // 👈 add this
    } = body;



    // ✅ Validate required fields
    if (!form_id || !form_name || !form_description || !industry) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: form_id, form_name, category, subcategory, industry",
        },
        { status: 400 }
      );
    }

    // ✅ form_id rules: lowercase, no spaces, hyphen allowed, numbers allowed
    const formIdRegex = /^[a-z0-9-]+$/;
    if (!formIdRegex.test(form_id)) {
      return NextResponse.json(
        {
          error:
            "Form ID must be lowercase letters, numbers, and hyphens only (e.g., reactjs-1, nodejs-2)",
        },
        { status: 400 }
      );
    }

    // ✅ Check uniqueness
    const { data: existingForm } = await supabaseAdmin
      .from("forms")
      .select("form_id")
      .eq("form_id", form_id)
      .maybeSingle();

    if (existingForm) {
      return NextResponse.json(
        { error: "Form ID already exists. Please choose a different ID." },
        { status: 409 }
      );
    }

    // ✅ Insert
    const { data, error } = await supabaseAdmin
      .from("forms")
      .insert([
        {
          form_id,
          form_name,
          form_description: form_description || null,
          industry,
          message: message || null,
          created_by: created_by || "admin",
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // ✅ Generate public form URL
    const baseUrl =
      process.env.APP_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const publicUrl = `${baseUrl}/form/${data.form_id}`;

    return NextResponse.json({
      form: data,
      url: publicUrl,
      success: true,
    });
  } catch (err: any) {
    console.error("Error creating form:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create form" },
      { status: 500 }
    );
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

// PUT endpoint for updating forms
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      id,
      form_id,
      form_name,
      form_description,
      category,
      subcategory,
      industry,
      tech_stack,
      tools,
      is_active,
      required_fields,
      custom_questions,
    } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Form ID is required for update" }, { status: 400 })
    }

    // Check if form exists
    const { data: existingForm } = await supabaseAdmin.from("forms").select("id").eq("id", id).single()

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Update form
    const { data, error } = await supabaseAdmin
      .from("forms")
      .update({
        form_id,
        form_name,
        form_description,
        category,
        subcategory,
        industry,
        tech_stack,
        tools,
        is_active,
        required_fields,
        custom_questions,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      form: data,
      success: true,
    })
  } catch (err: any) {
    console.error("Error updating form:", err)
    return NextResponse.json({ error: err.message || "Failed to update form" }, { status: 500 })
  }
}

// DELETE endpoint for deleting forms
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Form ID is required for deletion" }, { status: 400 })
    }

    // Check if form exists
    const { data: existingForm } = await supabaseAdmin.from("forms").select("id").eq("id", id).single()

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Delete form (this will cascade delete submissions due to foreign key constraint)
    const { error } = await supabaseAdmin.from("forms").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    })
  } catch (err: any) {
    console.error("Error deleting form:", err)
    return NextResponse.json({ error: err.message || "Failed to delete form" }, { status: 500 })
  }
}
