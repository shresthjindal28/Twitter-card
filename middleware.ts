import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/favicon.ico') {
    // Redirect favicon requests to the provided logo
    return NextResponse.redirect(new URL('/logo.png', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/favicon.ico'],
};
