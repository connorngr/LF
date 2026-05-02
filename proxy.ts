import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/auth'

const protectedRoutes = new Set(['/upload'])
const publicRoutes = new Set(['/auth/login', '/'])

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtectedRoute = Array.from(protectedRoutes).some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.has(pathname)

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  const isAuthenticated = authCookie?.value === AUTH_COOKIE_VALUE

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicRoute && isAuthenticated && pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/upload', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
