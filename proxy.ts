import { ROUTER_PATH, TOAST_COOKIE_NAME, TOAST_REASON } from '@/shared/config'
import { NextResponse, type NextRequest } from 'next/server'

function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_LHCI === 'true') {
    return NextResponse.next()
  }

  const leagueId = Number(request.cookies.get('league-id')?.value)
  if (!leagueId) {
    const url = new URL(ROUTER_PATH.HOME, request.url)

    const response = NextResponse.redirect(url)
    response.cookies.set(TOAST_COOKIE_NAME, TOAST_REASON.NO_LEAGUE, {
      maxAge: 60,
      path: '/',
      sameSite: 'lax',
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/submission', '/submission/:path*'],
}

export default proxy
