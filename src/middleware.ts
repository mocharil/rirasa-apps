import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const path = request.nextUrl.pathname;
  
  console.log('Middleware: Request info:', { 
    path, 
    isAuthenticated,
    cookies: request.cookies.toString(),
    destination: request.nextUrl.toString()
  });

  // Protected routes
  if (!isAuthenticated && (
    path.startsWith('/dashboard') ||
    path.startsWith('/analytics') ||
    path.startsWith('/citizen-engagement')
  )) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect ke dashboard jika sudah login tapi mencoba akses login page
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analytics/:path*',
    '/citizen-engagement/:path*',
    '/login'
  ]
};