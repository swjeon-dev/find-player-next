'use server'

import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

const COOKIE_NAME = 'league-id'

export async function selectLeagueAction(leagueId: number) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, String(leagueId), {
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
  })

  redirect('/submission', RedirectType.replace)
}
