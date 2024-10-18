import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  if (url.pathname !== '/blog') {
    return NextResponse.redirect(new URL('/blog', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
