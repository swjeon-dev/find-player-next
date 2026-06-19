import { fetchLeagueListServer } from '@/shared/api/server/fetchLeagueList'

import { leagueDto } from './leagueDto'

export function parseLeagueIdCookie(value: string | undefined): number | null {
  if (!value) return null

  const leagueId = Number(value)
  if (!Number.isInteger(leagueId) || leagueId <= 0) return null

  return leagueId
}

export async function getValidLeagueIds(): Promise<number[]> {
  const leagues = await fetchLeagueListServer()

  return leagueDto(leagues).map(league => league.id)
}

export function isValidLeagueId(
  leagueId: number,
  validLeagueIds: number[],
): boolean {
  return (
    Number.isInteger(leagueId) &&
    leagueId > 0 &&
    validLeagueIds.includes(leagueId)
  )
}
