import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

/**
 * POST /api/forms/client
 * Simplified endpoint for clients to auto-generate draft forms.
 * Clients provide minimal info (category, subcategory, tech_stack, industry)
 * The system fills out all other fields and marks the form as pending review.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received client form data:", body);

    const { category, subcategory, tech_stack, industry, created_by } = body;

    // ✅ Validate minimal required client fields
    if (!category || !subcategory || !tech_stack?.length || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: category, subcategory, tech_stack, or industry." },
        { status: 400 }
      );
    }

    // ✅ Generate unique form_id (slug-style)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    const form_id = `${subcategory.toLowerCase().replace(/\s+/g, "-")}-${tech_stack[0]
      .toLowerCase()
      .replace(/\s+/g, "-")}-${randomSuffix}`;

    // ✅ Auto-generate form name and description
    const form_name = `${subcategory} Freelancer Form`;
    const form_description = `We are seeking talented ${subcategory.toLowerCase()} freelancers experienced in ${tech_stack.join(
      ", "
    )} for ${industry} projects.`;

    // ✅ Default message for freelancers
    const message = "Please fill out the details below to apply for this opportunity.";

    // ✅ Insert into Supabase with default review status
    const { data, error } = await supabaseAdmin
      .from("forms")
      .insert([
        {
          form_id,
          form_name,
          form_description,
          industry,
          category,
          subcategory,
          tech_stack,
          message,
          created_by: created_by || "client",
          is_active: false, // admin must review before activation
          status: "pending_review", // new column to distinguish drafts
          auto_generated: true, // mark that it was auto-created
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    // ✅ Build preview URL (for admin or client confirmation)
    const baseUrl =
      process.env.APP_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const previewUrl = `${baseUrl}/form/${data.form_id}`;

    return NextResponse.json({
      success: true,
      form: data,
      preview_url: previewUrl,
      message: "Form created successfully and is pending admin review.",
    });
  } catch (err: any) {
    console.error("Error creating client form:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create client form" },
      { status: 500 }
    );
  }
}
