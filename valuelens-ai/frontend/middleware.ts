import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/assessment',
  '/scenarios',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('valuelens_session')?.value;
  const clientAuthCookie = request.cookies.get('valuelens_client_auth')?.value;
  const isAuthenticated = !!(sessionCookie || clientAuthCookie);

  // 1. If user visits root '/' without authentication, display login page initially
  if (pathname === '/') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Protect enterprise dashboard and assessment flows
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/assessment',
    '/assessment/:path*',
    '/scenarios',
    '/scenarios/:path*',
  ],
};
