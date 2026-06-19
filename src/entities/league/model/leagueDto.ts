import type { ILeague, ILeagueInfo } from '@common/model'

export const leagueDto = (leagues: Record<string, ILeague>): ILeagueInfo[] => {
  return Object.entries(leagues).map(([_, value]) => value.info)
}
