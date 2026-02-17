import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple HTTP Basic Auth middleware
const USER = 'hape'
const PASS = 'hape2026'

export function middleware(request: NextRequest) {
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

  return NextResponse.next()
}

export const config = {
  // Exclude PWA assets from auth so iOS can install the app
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon-.*|manifest.json|icons/.*).*)'],
}
