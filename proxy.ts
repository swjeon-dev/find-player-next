import {
  FLASH_TOAST_COOKIE_NAME,
  FLASH_TOAST_REASON,
  LEAGUE_ID_COOKIE_NAME,
  ROUTER_PATH,
  type FlashToastReason,
} from '@/shared/config'
import {
  getValidLeagueIds,
  isValidLeagueId,
  parseLeagueIdCookie,
} from '@/entities/league/model/leagueValidation'
import { NextResponse, type NextRequest } from 'next/server'

function clearLeagueIdCookie(response: NextResponse) {
  response.cookies.set(LEAGUE_ID_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  })
}

function redirectHomeWithFlash(
  request: NextRequest,
  reason: FlashToastReason,
  options?: { clearLeagueCookie?: boolean },
) {
  const url = new URL(ROUTER_PATH.HOME, request.url)
  const response = NextResponse.redirect(url)

  response.cookies.set(FLASH_TOAST_COOKIE_NAME, reason, {
    maxAge: 60,
    path: '/',
    sameSite: 'lax',
  })

  if (options?.clearLeagueCookie) {
    clearLeagueIdCookie(response)
  }

  return response
}

async function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_LHCI === 'true') {
    return NextResponse.next()
  }

  const leagueId = parseLeagueIdCookie(
    request.cookies.get(LEAGUE_ID_COOKIE_NAME)?.value,
  )

  if (!leagueId) {
    return redirectHomeWithFlash(request, FLASH_TOAST_REASON.NO_LEAGUE, {
      clearLeagueCookie: true,
    })
  }

  try {
    const validLeagueIds = await getValidLeagueIds()

    if (!isValidLeagueId(leagueId, validLeagueIds)) {
      return redirectHomeWithFlash(request, FLASH_TOAST_REASON.INVALID_LEAGUE, {
        clearLeagueCookie: true,
      })
    }
  } catch {
    return redirectHomeWithFlash(
      request,
      FLASH_TOAST_REASON.LEAGUE_LIST_UNAVAILABLE,
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/submission', '/submission/:path*'],
}

export default proxy
