import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  if (!request.cookies.get('af_sid')) {
    const sessionId = crypto.randomUUID()
    response.cookies.set('af_sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }
  return response
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
}
