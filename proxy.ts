import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // If not logged in and not on login page, redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and on login page, redirect to home
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Only run middleware on the main routes to protect them
export const config = {
  matcher: ['/', '/dashboard', '/login'],
}
