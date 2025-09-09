import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const clientAuth = cookieStore.get("client_auth");

    if (!clientAuth) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const { email } = JSON.parse(clientAuth.value);

    const { data, error } = await supabaseAdmin
      .from("client_table")
      .select("email, name, company_name, website, industry, phone")
      .eq("email", email)
      .single();

    if (error || !data) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Required fields to consider profile complete
    const requiredFields = ["name", "company_name", "website", "industry", "phone"];
    const isComplete = requiredFields.every((field) => (data as any)[field] && (data as any)[field] !== "");

    if (!isComplete) {
      return NextResponse.json({ exists: false, client: data }, { status: 200 });
    }

    return NextResponse.json({ exists: true, client: data });
  } catch (err) {
    console.error("Error in /api/client/me:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
