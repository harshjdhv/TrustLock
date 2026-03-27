import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const session = await verifySessionToken(token)

  if (session) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/"
  loginUrl.searchParams.set("auth", "required")

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
