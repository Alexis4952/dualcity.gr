import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Προστασία admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Έλεγχος για admin authentication
    const adminToken = request.cookies.get("admin-token")

    if (!adminToken && !request.nextUrl.pathname.startsWith("/admin-login")) {
      return NextResponse.redirect(new URL("/admin-login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
