import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretString = process.env.JWT_SECRET || "fallback_secret_key_123";
const JWT_SECRET = new TextEncoder().encode(secretString);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};