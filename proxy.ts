import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth pages without session
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Check for session cookie (basic check - real validation happens on backend)
  const hasSession = request.cookies.has('session') || 
                     request.headers.get('cookie')?.includes('session');

  // Redirect to auth if accessing protected routes without session
  if (!hasSession && (pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/incidents') || 
                      pathname.startsWith('/alerts') ||
                      pathname.startsWith('/cameras') ||
                      pathname.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon\\.svg|icon-.*\\.png|apple-icon\\.png).*)',
  ],
};
