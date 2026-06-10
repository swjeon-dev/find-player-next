import { footballApiInstance } from '../api/externalClient'
import { FOOTBAL_API_ENDPOINT } from '../constant/footballRoutes'
import { fetchErrorLogger } from '../api/api'
import type {
  IGetLeagueTable,
  IGetTeamSquads,
  IGetTeamSquadsResponse,
  IResponse,
} from '../types/api-external.types'
import { sleep } from '../utils/timer'

// fetchSquadData 요청 실패시 1회 재요청
export const fetchSquadDataWithRetry = async (
  teamId: number,
  retries = 2,
): Promise<IGetTeamSquadsResponse> => {
  try {
    return await fetchSquadData(teamId)
  } catch (error: unknown) {
    if (retries > 0) {
      console.log(
        `⚠️ Rate Limit 감지됨. 65초 대기 후 재시도합니다... (남은 횟수: ${retries})`,
      )
      await sleep(65000) // 1분 윈도우가 완전히 초기화되도록 넉넉히 대기
      return fetchSquadDataWithRetry(teamId, retries - 1)
    }
    throw error
  }
}

// 팀의 선수 정보 가져오기
export const fetchSquadData = async (
  teamId: number,
): Promise<IGetTeamSquadsResponse> => {
  try {
    const response = await footballApiInstance.get<IGetTeamSquads>(
      FOOTBAL_API_ENDPOINT.TEAM_SQUADS,
      {
        params: { team: teamId },
      },
    )
    if (!response.data?.response?.length)
      throw new Error('팀의 선수 정보를 가져오지 못했습니다.')

    return response.data.response[0]
  } catch (error) {
    fetchErrorLogger(error, 'externalService - fetchSquadData')
    throw error
  }
}

interface IFetchLeague {
  league: number
  season: number
}

// 리그 내 팀 정보 가져오기
export const fetchLeagueTableData = async ({
  league,
  season,
}: IFetchLeague): Promise<IResponse[]> => {
  try {
    const response = await footballApiInstance.get<IGetLeagueTable>(
      FOOTBAL_API_ENDPOINT.LEAGUE_TABLE,
      {
        params: { league, season },
      },
    )

    if (!response.data?.response?.length)
      throw new Error('리그 테이블을 가져오지 못했습니다.')

    return response.data?.response
  } catch (error) {
    fetchErrorLogger(error, 'externalService - fetchLeagueTableData')
    return []
  }
}
