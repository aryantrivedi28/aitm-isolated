import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Explicitly skip the root /find-talent (with or without trailing slash)
  if (pathname === "/find-talent" || pathname === "/find-talent/") {
    return NextResponse.next();
  }

  // Check only protected routes
  // For find-talent, only protect sub-routes, not the root path
  if ((pathname.startsWith("/find-talent/") || pathname.startsWith("/api/client"))) {
    const authCookie = req.cookies.get("client_auth")?.value;

    if (!authCookie) {
      const loginUrl = new URL("/find-talent", req.url);
      loginUrl.searchParams.set("redirect", pathname); // optional redirect back
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

