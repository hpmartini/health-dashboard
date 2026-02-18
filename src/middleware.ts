import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple HTTP Basic Auth middleware with cookie session
const USER = 'hape'
const PASS = 'hape2026'
const SESSION_COOKIE = 'health_session'
const SESSION_VALUE = 'authenticated_v1'
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export function middleware(request: NextRequest) {
  // Check for existing session cookie first
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  if (sessionCookie?.value === SESSION_VALUE) {
    return NextResponse.next()
  }

  // No valid session, check Basic Auth
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Health Dashboard"',
      },
    })
  }

  const [scheme, encoded] = authHeader.split(' ')

  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Invalid authentication', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Health Dashboard"',
      },
    })
  }

  const decoded = atob(encoded)
  const [user, pass] = decoded.split(':')

  if (user !== USER || pass !== PASS) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Health Dashboard"',
      },
    })
  }

  // Valid auth - set session cookie and continue
  const response = NextResponse.next()
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  
  return response
}

export const config = {
  // Exclude PWA assets from auth so iOS can install the app
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon-.*|manifest.json|icons/.*).*)'],
}
