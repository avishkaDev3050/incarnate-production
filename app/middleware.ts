// app/middleware.ts or middleware.ts (root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Changed from 'next/request'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('instructor_token');
  const { pathname } = request.nextUrl;

  // 1. Redirect to login if trying to access dashboard without a token
  if (pathname.startsWith('/instructor') && !pathname.startsWith('/instructor/login') && !token) {
    return NextResponse.redirect(new URL('/instructor/login', request.url));
  }

  // 2. Redirect to dashboard if trying to access login while already authenticated
  if (pathname.startsWith('/instructor/login') && token) {
    return NextResponse.redirect(new URL('/instructor', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // This ensures middleware runs for all instructor routes
  matcher: ['/instructor/:path*'],
};