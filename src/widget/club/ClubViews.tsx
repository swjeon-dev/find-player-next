'use client'

import { useRecoilValue } from 'recoil'

import { useClubTabletPanel } from '@/entities/club'
import {
  leagueInfoState,
  useFetchingTeamsDataInLeague,
} from '@/entities/league'

import ClubViewsError from './ui/ClubViewsError'
import ClubViewsContent from './ui/ClubViewsContent'

function ClubViews() {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const { teamIdsQuery, teamDatasQuery } = useFetchingTeamsDataInLeague(
    leagueInfo.id ?? 0,
  )
  const tabletPanel = useClubTabletPanel()

  if (!leagueInfo.id) return null

  if (teamIdsQuery.error) {
    return <ClubViewsError onRetry={() => teamIdsQuery.refetch()} />
  }

  const isInitialLoading = teamIdsQuery.isPending
  const isAnyTeamLoading = teamDatasQuery.some(q => q.isPending)
  const teamIds = teamIdsQuery.data ?? []
  const teamDatas = teamDatasQuery.map(q => q.data)

  return (
    <ClubViewsContent
      {...tabletPanel}
      isInitialLoading={isInitialLoading}
      isAnyTeamLoading={isAnyTeamLoading}
      teamIds={teamIds}
      teamDatas={teamDatas}
    />
  )
}

export default ClubViews

// /**
//  *
// | 컴포넌트        | mount |   update |    총 렌더링 |
// | ----------- | ----: | -------: | -------: |
// | `ClubViews` |    1회 |       9회 |      10회 |
// | `Club`      |   12회 | 약 39~40회 | 약 51~52회 |

// 성능에 문제는 없지만 리렌더링 횟수가 많음.
// 1. club 컴포넌트 메모제이션
// 2. array 컴포넌트의 index를 id로 변경
// > 횟수 변화
//  actualDuration < baseDuration
// 패턴이 반복되는 것은 React가 memo 비교 후 렌더를 skip했다는 의미입니다.
// | 컴포넌트        | mount | update | 총 렌더링 |
// | ----------- | ----: | -----: | ----: |
// | `ClubViews` |    1회 |     6회 |    7회 |
// | `Club`      |   10회 |     0회 |   10회 |

// * 성능 메모:
//  * - Club memo + key 안정화 후 Club의 불필요한 update 렌더를 줄였습니다.
//  * - ClubViews는 데이터 상태 변화에 따라 update가 발생하며, 현재 체감 성능 문제는 없습니다.
//  */
