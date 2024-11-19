import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // Protected routes
  if (
    !isAuthenticated && 
    (request.nextUrl.pathname.startsWith('/dashboard') ||
     request.nextUrl.pathname.startsWith('/analytics') ||
     request.nextUrl.pathname.startsWith('/citizen-engagement'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirect to dashboard if logged in and trying to access login page
  if (isAuthenticated && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/analytics/:path*', 
    '/citizen-engagement/:path*',
    '/login'
  ]
}