import type { ILeague, ILeagueInfo } from '@common/model'

export const leagueDto = (leagues: Record<string, ILeague>): ILeagueInfo[] => {
  const leaguesInfo = Object.entries(leagues).map(([_, value]) => value.info)

  // TODO: 리그 목록이 없을 경우 처리
  // if (leaguesInfo.length === 0 && !leaguesInfo) {
  //   throw []
  // }

  return leaguesInfo
}
