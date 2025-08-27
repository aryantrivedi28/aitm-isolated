import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check only protected routes
  if (pathname.startsWith("/find-talent") || pathname.startsWith("/api/client")) {
    const authCookie = req.cookies.get("client_auth")?.value;

    if (!authCookie) {
      const loginUrl = new URL("/verify", req.url);
      loginUrl.searchParams.set("redirect", pathname); // optional redirect back
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/find-talent/:path*"],
};

