import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export const dynamic = "force-dynamic"; // ✅ Important: allows using cookies

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
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ exists: true, client: data });
  } catch (err) {
    console.error("Error in /api/client/me:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
