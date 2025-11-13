import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1️⃣ Public routes — always accessible
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // 2️⃣ Public client-facing entry points
  if (pathname === "/find-talent" || pathname === "/find-talent/") {
    return NextResponse.next()
  }

  if (pathname.startsWith("/app/verify-and-apply") || pathname.startsWith("/verify-and-apply")) {
    return NextResponse.next()
  }

  // 3️⃣ ✅ Protect client routes
  if (pathname.startsWith("/find-talent/") || pathname.startsWith("/api/client")) {
    const authCookie = req.cookies.get("client_auth")?.value

    if (!authCookie) {
      const loginUrl = new URL("/find-talent", req.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 4️⃣ ✅ Protect admin routes
  if (pathname.startsWith("/admin-panel")) {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (!token) {
      console.log("❌ Invalid admin token, redirecting to login")
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // 5️⃣ ✅ Protect freelancer routes
  if (pathname.startsWith("/get-hired/freelancer")) {
    const freelancerSession = req.cookies.get("freelancer_session")?.value

    const protectedPaths = [
      "/get-hired/freelancer/dashboard",
      "/get-hired/freelancer/profile",
      "/get-hired/freelancer/onboarding",
      "/get-hired/freelancer/apply",
    ]

    const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
    const isLoginPage = pathname === "/get-hired/freelancer" || pathname === "/get-hired/freelancer/"

    // 🚫 Not logged in → redirect to login
    if (isProtected && !freelancerSession) {
      const loginUrl = new URL("/get-hired/freelancer", req.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // ✅ Already logged in → prevent visiting login page again
    if (isLoginPage && freelancerSession) {
      const dashboardUrl = new URL("/get-hired/freelancer/dashboard", req.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  if (pathname.startsWith("/get-hired/verify-and-apply")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// ✅ Match all route groups we want middleware to apply on
export const config = {
  matcher: [
    "/find-talent/:path*",
    "/api/client/:path*",
    "/admin-panel/:path*",
    "/get-hired/freelancer/:path*",
    "/get-hired/verify-and-apply/:path*",
  ],
}
