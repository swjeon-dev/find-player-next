import { FIREBASE_API_ENDPOINT } from '../config'
import {
  getFirebaseURLPath,
  type FirebaseReturnPath,
} from '../config/firebasePath'
import type { IFirebasePlayer, IFirebaseTeamDetail } from '../types'
import { firebaseApiInstance } from './client'

export type FilteringPlayerNode = {
  info: IFirebasePlayer
}

export type FilteringPlayersByNameRaw = Record<string, FilteringPlayerNode>

const fetchFirebaseData = async <T>(path: FirebaseReturnPath): Promise<T> => {
  const response = await firebaseApiInstance.get<T>(path)

  return response.data
}

export const fetchTeam = async (
  teamId: number,
): Promise<IFirebaseTeamDetail> => {
  const url = FIREBASE_API_ENDPOINT.TEAM_DETAIL(teamId)

  return await fetchFirebaseData<IFirebaseTeamDetail>(getFirebaseURLPath(url))
}

export const fetchTeamIdsInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  const url = FIREBASE_API_ENDPOINT.LEAGUE_TEAM_IDS(leagueId)

  return await fetchFirebaseData<number[]>(getFirebaseURLPath(url))
}

export const fetchPlayer = async (
  playerId: number,
): Promise<IFirebasePlayer> => {
  const url = FIREBASE_API_ENDPOINT.PLAYERS(playerId)

  return await fetchFirebaseData<IFirebasePlayer>(getFirebaseURLPath(url))
}

export const fetchTeamPlayerIds = async (teamId: number): Promise<number[]> => {
  const url = FIREBASE_API_ENDPOINT.TEAM_PLAYER_IDS(teamId)

  return await fetchFirebaseData<number[]>(getFirebaseURLPath(url))
}

export const fetchPlayerIdsInLeague = async (
  leagueId: number,
): Promise<number[]> => {
  const url = FIREBASE_API_ENDPOINT.LEAGUE_PLAYER_IDS(leagueId)

  return await fetchFirebaseData<number[]>(getFirebaseURLPath(url))
}

export const fetchFilteringPlayersByName = async ({
  limit,
  capitalizedValue,
}: {
  limit: number
  capitalizedValue: string
}): Promise<FilteringPlayersByNameRaw> => {
  const url = FIREBASE_API_ENDPOINT.TOTAL_PLAYERS()

  const params = new URLSearchParams({
    orderBy: JSON.stringify('info/name'),
    limitToFirst: String(limit),
    startAt: JSON.stringify(capitalizedValue),
    endAt: JSON.stringify(`${capitalizedValue}\uf8ff`),
  })

  const pathWithQuery =
    `${getFirebaseURLPath(url)}?${params.toString()}` as FirebaseReturnPath
  return await fetchFirebaseData<FilteringPlayersByNameRaw>(pathWithQuery)
}
