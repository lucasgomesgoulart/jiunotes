import { NextRequest, NextResponse } from 'next/server'
import { unsealData } from 'iron-session'
import type { SessionData } from '@/lib/session'

const COOKIE_NAME = 'jiunotes-session'

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login'

  let isLoggedIn = false
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value

  if (cookieValue) {
    try {
      const session = await unsealData<SessionData>(cookieValue, {
        password: process.env.SESSION_SECRET!,
      })
      isLoggedIn = session.isLoggedIn === true
    } catch {
      // invalid or expired session
    }
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/alunos', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
