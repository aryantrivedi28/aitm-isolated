// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "../../../../lib/auth"; // ✅ adjust path if needed

const ALLOWED_DOMAIN = process.env.EMAIL_AUTH || "@finzie.in";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    if (!email.endsWith(ALLOWED_DOMAIN)) {
      return NextResponse.json(
        { message: "Unauthorized - use your company email" },
        { status: 401 }
      );
    }

    // ✅ Create JWT token valid for 12h (await because signToken is async)
    const token = await signToken({ email }, "12h");

    // ✅ Set secure cookie
    const res = NextResponse.json({ success: true, email });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 6, // 6 hours
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
