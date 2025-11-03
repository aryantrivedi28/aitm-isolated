import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/SupabaseAuthClient";

export async function POST(req: Request) {

  try {

    // --- Parse body ---
    const body = await req.json();

    const {
      form_id: incomingFormId,
      form_name,
      form_description,
      industry,
      category,
      subcategory,
      tech_stack,
      tools,
      required_fields,
      custom_questions,
      message,
      hiring_request_id,
      client_id,
      owner_id,
    } = body;

    // --- Validate required fields ---
    if (!form_name || !industry) {
      return NextResponse.json(
        { error: "Form name and industry are required." },
        { status: 400 }
      );
    }

    // --- Define form identity ---
    const form_id = incomingFormId || `admin_${Date.now()}`;
    const created_by = "admin";
    const role = "admin";

    const { data, error } = await supabase
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
          tools,
          required_fields,
          custom_questions,
          message,
          created_by,
          role,
          owner_id: owner_id || null,
          client_id: client_id || null,
          hiring_request_id: hiring_request_id || null,
        },
      ])
      .select()
      .single();
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Form ID already exists. Please choose a different ID." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Database error: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("🔥 [DEBUG] Caught Exception:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    return NextResponse.json(
      { error: "Internal Server Error: " + err.message },
      { status: 500 }
    );
  } finally {
    console.groupEnd();
  }
}
