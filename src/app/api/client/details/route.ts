import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    console.log("🔹 Updating client details...");

    const body = await req.json();
    const { name, company_name, website, industry, phone } = body;

    console.log("📦 Request body:", body);

    // ✅ Validate fields
    if (!name || !company_name || !website || !industry || !phone) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Get cookie (no await needed in Next.js 13+)
    const cookieStore = await cookies();
    const session = cookieStore.get("client_auth")?.value;
    console.log("🍪 Raw cookie session:", session);

    if (!session) {
      console.error("❌ No session found in cookies");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Parse cookie
    let email: string | null = null;
    try {
      const parsed = JSON.parse(session);
      console.log("✅ Parsed cookie:", parsed);
      email = parsed.email;
    } catch (err) {
      console.error("❌ Cookie JSON parse error:", err);
      return NextResponse.json(
        { success: false, error: "Invalid session format" },
        { status: 400 }
      );
    }

    if (!email) {
      console.error("❌ Email missing in session");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Update client details in Supabase
    console.log("🔄 Updating client_table for email:", email);

    const { data, error } = await supabaseAdmin
      .from("client_table")
      .update({ name, company_name, website, industry, phone })
      .eq("email", email)
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase update error:", error);
      throw error;
    }

    console.log("✅ Update successful:", data);

    return NextResponse.json({ success: true, client: data });
  } catch (err: any) {
    console.error("🔥 Unexpected error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
