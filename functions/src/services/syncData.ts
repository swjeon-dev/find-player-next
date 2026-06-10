import { sleep } from '../utils/timer'
import type { ITeam1 } from '../types/api-external.types'
import {
  fetchLeagueTableData,
  fetchSquadDataWithRetry,
} from './externalService'
import { adminDb } from '../firebase/config'
import { ServerValue } from 'firebase-admin/database'
import { DEFAULT_API_PARAMS } from '@common/config'
import type { IFirebasePlayer } from '@common/model'
import { fetchErrorLogger } from '../api/api'

type IFirebaseObject = Record<string, any>

export const syncData = async (): Promise<void> => {
  console.log('Firebase의 데이터 동기화 작업을 시작합니다')

  try {
    const leagueTableData = await fetchLeagueTableData(DEFAULT_API_PARAMS)

    if (!leagueTableData || leagueTableData.length === 0)
      throw new Error('리그 데이터를 가져오지 못했습니다.')

    const playerIdsInLeague: number[] = []
    const teamIds: number[] = []

    const tableData = leagueTableData.slice(0)
    for (const { team } of tableData) {
      try {
        const teamUpdates: IFirebaseObject = {}
        const playerIdsInTeam = await syncTeam(team, teamUpdates)

        await adminDb.ref().update(teamUpdates)

        playerIdsInLeague.push(...playerIdsInTeam)
        teamIds.push(team.id)

        console.log(`${team.name} 데이터 동기화 완료`)
      } catch (error) {
        console.error(`${team.name} 데이터 동기화 실패`)
      }
      await sleep(10000)
    }

    const dataToStore: IFirebaseObject = {
      [`leagues/${DEFAULT_API_PARAMS.league}/updatedAt`]: ServerValue.TIMESTAMP,
      [`leagues/${DEFAULT_API_PARAMS.league}/playerIds`]: playerIdsInLeague,
      [`leagues/${DEFAULT_API_PARAMS.league}/teamIds`]: teamIds,
    }

    await adminDb.ref().update(dataToStore)

    console.log('Firebase의 데이터 동기화 작업을 종료합니다')
  } catch (error) {
    fetchErrorLogger(error, 'syncData - syncData')
    await sleep(65000)
  }
}

const syncTeam = async (
  team: ITeam1,
  updates: IFirebaseObject,
): Promise<number[]> => {
  updates[`teams/${team.id}/info`] = { ...team }
  updates[`teams/${team.id}/updatedAt`] = ServerValue.TIMESTAMP

  const squadData = await fetchSquadDataWithRetry(team.id)
  const players = squadData?.players || []

  if (players.length === 0) {
    console.warn(`${team.name} 선수 데이터가 없습니다`)
    updates[`teams/${team.id}/playerIds`] = []

    return []
  } else {
    const playerIds = players.map(player => {
      const playerAddedTeamInfo: IFirebasePlayer = {
        ...player,
        name: removeSpecialAlpha(player.name),
        teamId: team.id,
        teamLogo: team.logo,
        leagueId: DEFAULT_API_PARAMS.league,
      }

      updates[`players/${player.id}/info`] = playerAddedTeamInfo
      updates[`players/${player.id}/updatedAt`] = ServerValue.TIMESTAMP
      return player.id
    })

    updates[`teams/${team.id}/playerIds`] = playerIds
    return playerIds
  }
}

// 특수 알파벳 제거: 'B. ŠEŠKO' -> 'B. SESKO
const removeSpecialAlpha = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
