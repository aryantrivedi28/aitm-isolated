import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/SupabaseAuthClient"; // your Supabase server client

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      form_name,
      form_description,
      industry,
      category,
      subcategory,
      tech_stack,
      tools,
      required_fields,
      custom_questions,
      user, // { role, email }
      form_id: incomingFormId, // admin only
    } = body;

    if (!user) {
      return NextResponse.json(
        { error: "Missing user context." },
        { status: 400 }
      );
    }

    // Role-based logic
    const isAdmin = user.role === "admin";

    const form_id = isAdmin
      ? incomingFormId
      : `client_${Date.now()}`;

    if (!form_name || !industry) {
      return NextResponse.json(
        { error: "Form name and industry are required." },
        { status: 400 }
      );
    }

    const created_by = isAdmin ? "admin" : user.email;

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
          created_by,
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
    console.error("Error creating form:", err);
    return NextResponse.json(
      { error: "Internal Server Error: " + err.message },
      { status: 500 }
    );
  }
}
