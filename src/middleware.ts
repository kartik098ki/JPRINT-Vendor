import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Temporarily disable middleware to debug login issue
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Define public paths that don't require authentication
  const publicPaths = ['/']
  
  // Get the current path
  const path = request.nextUrl.pathname

  // If it's a public path, continue
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // For API routes, check session
  if (path.startsWith('/api/')) {
    // Skip auth check for all API endpoints temporarily
    console.log('Skipping auth check for API path:', path)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}