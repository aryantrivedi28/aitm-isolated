import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const protectedRoutes = [
    "/find-talent",
    "/api/client/details",
    "/api/client/hiring",
    "/api/client/me"
  ];

  const { pathname } = req.nextUrl

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const authCookie = req.cookies.get("client_auth")?.value
    if (!authCookie) {
      const loginUrl = new URL("/verify", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/find-talent/option/:path*"],
}
