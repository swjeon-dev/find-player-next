import type {
  IFirebasePlayer,
  IFirebaseTeamDetail,
  ILeague,
} from '@common/model'
import RTDB_API_ENDPOINT from '../../config/rtdbRoute'
import { getRtdbURLPath } from '../../config/rtdbPath'
import defaultClientFetch from './defaultFetch'

type FilteringPlayerNode = {
  info: IFirebasePlayer
}
export type FilteringPlayersByNameRaw = Record<string, FilteringPlayerNode>

export const fetchTeam = async (
  teamId: number,
): Promise<IFirebaseTeamDetail> => {
  const url = RTDB_API_ENDPOINT.TEAM_DETAIL(teamId)

  return await defaultClientFetch<IFirebaseTeamDetail>(
    getRtdbURLPath(url),
    'fetch team',
  )
}

export const fetchTeamIdsInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  const url = RTDB_API_ENDPOINT.LEAGUE_TEAM_IDS(leagueId)

  return await defaultClientFetch<number[]>(
    getRtdbURLPath(url),
    'fetch team ids in league',
  )
}

export const fetchPlayer = async (
  playerId: number,
): Promise<IFirebasePlayer> => {
  const url = RTDB_API_ENDPOINT.PLAYERS(playerId)

  return await defaultClientFetch<IFirebasePlayer>(
    getRtdbURLPath(url),
    'fetch player',
  )
}

export const fetchTeamPlayerIds = async (teamId: number): Promise<number[]> => {
  const url = RTDB_API_ENDPOINT.TEAM_PLAYER_IDS(teamId)

  return await defaultClientFetch<number[]>(
    getRtdbURLPath(url),
    'fetch team player ids',
  )
}

export const fetchPlayerIdsInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  if (!leagueId) return []
  const url = RTDB_API_ENDPOINT.LEAGUE_PLAYER_IDS(leagueId)

  return await defaultClientFetch<number[]>(
    getRtdbURLPath(url),
    'fetch player ids in league',
  )
}

export const fetchFilteringPlayersByName = async ({
  limit,
  capitalizedValue,
}: {
  limit: number
  capitalizedValue: string
}): Promise<FilteringPlayersByNameRaw> => {
  const url = RTDB_API_ENDPOINT.TOTAL_PLAYERS()

  const params = new URLSearchParams({
    orderBy: JSON.stringify('info/name'),
    limitToFirst: String(limit),
    startAt: JSON.stringify(capitalizedValue),
    endAt: JSON.stringify(`${capitalizedValue}\uf8ff`),
  })

  const pathWithQuery = `${getRtdbURLPath(url)}?${params.toString()}`

  return await defaultClientFetch<FilteringPlayersByNameRaw>(
    pathWithQuery,
    'fetch filtering players by name',
  )
}
