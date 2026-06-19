'use server'

import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

import {
  getValidLeagueIds,
  isValidLeagueId,
} from '@/entities/league/model/leagueValidation'
import {
  LEAGUE_ID_COOKIE_NAME,
  LEAGUE_ID_COOKIE_OPTIONS,
  NOTIFICATION_REASON,
  type NotificationReason,
} from '@/shared'

export type SelectLeagueResult =
  | { ok: true }
  | { ok: false; reason: NotificationReason }

export async function selectLeagueAction(
  leagueId: number,
): Promise<SelectLeagueResult> {
  const validLeagueIds = await getValidLeagueIds()

  if (!isValidLeagueId(leagueId, validLeagueIds)) {
    return { ok: false, reason: NOTIFICATION_REASON.LEAGUE_SELECT_UNAVAILABLE }
  }

  const cookieStore = await cookies()
  cookieStore.set(LEAGUE_ID_COOKIE_NAME, String(leagueId), {
    ...LEAGUE_ID_COOKIE_OPTIONS,
  })

  redirect('/submission', RedirectType.replace)
}
