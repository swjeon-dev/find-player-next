import { fetchLeaguesInfoServer } from './leagueList.server'

export function parseLeagueIdCookie(value: string | undefined): number | null {
  if (!value) return null

  const leagueId = Number(value)
  if (!Number.isInteger(leagueId) || leagueId <= 0) return null

  return leagueId
}

export async function getValidLeagueIds(): Promise<number[]> {
  const leaguesInfo = await fetchLeaguesInfoServer()

  return leaguesInfo.map(league => league.id)
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
