import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    console.log("📥 Incoming hiring request...");

    const body = await req.json();
    console.log("📝 Request body:", body);

    const {
      role_type,
      job_title,
      description,
      budget_range,
      category,
      subcategory,
      tools,
    } = body;

    // ✅ Basic validation
    if (!role_type || !job_title || !description || !budget_range || !category) {
      console.error("⚠️ Missing required fields in request body");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Read cookie for client session
    const cookieStore = await cookies();
    const session = cookieStore.get("client_auth")?.value;

    console.log("🍪 Raw cookie session:", session);

    if (!session) {
      console.error("❌ No client_auth cookie found. Unauthorized request.");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let email: string | undefined;
    try {
      const parsed = JSON.parse(session);
      email = parsed?.email;
      console.log("✅ Parsed cookie:", parsed);
      console.log("📧 Extracted email:", email);
    } catch (err) {
      console.error("❌ Cookie JSON parse error:", err);
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 });
    }

    if (!email) {
      console.error("❌ No email found in session cookie");
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 400 });
    }

    // ✅ Get client_id from database
    console.log("🔎 Fetching client_id for email:", email);

    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("client_table")
      .select("id")
      .eq("email", email)
      .single();

    if (clientError) {
      console.error("❌ Error fetching client_id:", clientError);
      return NextResponse.json({ success: false, error: clientError.message }, { status: 500 });
    }

    if (!clientData) {
      console.error("❌ No client found for email:", email);
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    const client_id = clientData.id;
    console.log("✅ Found client_id:", client_id);

    // ✅ Insert hiring request
    console.log("📤 Inserting new hiring request into 'hiring_requests'...");

    const { data, error } = await supabaseAdmin
      .from("hiring_requests")
      .insert([
        {
          client_id,
          role_type,
          job_title,
          description,
          budget_range,
          category,
          subcategory, // must be array if schema is text[]
          tools,       // must be array if schema is text[]
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("❌ Error inserting hiring request:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log("✅ Hiring request created successfully:", data);

    return NextResponse.json({ success: true, hiring: data });
  } catch (err: any) {
    console.error("🔥 Unexpected error in hiring request API:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
