import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  const { pathname } = request.nextUrl;

  const isAuthenticated = !!token;

  // 1. If user is logged in and visits login page, redirect to dashboard
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user is NOT logged in and visits a protected route, redirect to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. If admin tries to access marks or subjects pages, redirect to dashboard
  if (isAuthenticated && role === 'ADMIN') {
    if (pathname.startsWith('/dashboard/marks') || pathname.startsWith('/dashboard/subject')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};
