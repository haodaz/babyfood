import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const hasToken = request.cookies.has('auth_token')
    const url = request.nextUrl.clone()

    if (!hasToken && url.pathname !== '/login') {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (hasToken && url.pathname === '/login') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (error) {
    // Prevent 500 error on Vercel if edge fails
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/', '/dashboard', '/login'],
}
