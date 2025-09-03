// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/find-talent" || pathname === "/find-talent/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/find-talent/") || pathname.startsWith("/api/client")) {
    const authCookie = req.cookies.get("client_auth")?.value;

    if (!authCookie) {
      const loginUrl = new URL("/find-talent", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/admin-panel")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = await verifyToken(token); // ✅ await since async now

    if (!decoded) {
      console.log("❌ Invalid token, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/find-talent/:path*",
    "/api/client/:path*",
    "/admin-panel/:path*",
  ],
};
