import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

export default function proxy(
  request: NextRequest,
  event: NextFetchEvent
): NextResponse | Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get('user_id')?.value;
  const username = request.cookies.get('username')?.value;
  const protectedRoutes = ['/users/', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.includes(pathname);
  if (isProtectedRoute && !userId) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isAuthRoute && userId && username) {
    return NextResponse.redirect(new URL(`/users/${username}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
