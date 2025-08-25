import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect find-talent routes & API client routes
  if (pathname.startsWith("/find-talent") || pathname.startsWith("/api/client")) {
    const authCookie = req.cookies.get("client_auth")?.value
    if (!authCookie || authCookie === "") {
      // Redirect to login or home page
      return NextResponse.redirect(new URL("/verify", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/find-talent",
    "/find-talent/:path*",
    "/api/client/:path*"
  ],
}
