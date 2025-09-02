import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies(); // ✅ await here
  const clientAuth = cookieStore.get("client_auth");

  if (clientAuth) {
    try {
      const { email } = JSON.parse(clientAuth.value);
      return NextResponse.json({ authenticated: true, email });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  }

  return NextResponse.json({ authenticated: false });
}
