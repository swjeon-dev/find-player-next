import { useRecoilValue } from 'recoil'

import { Club, useClubTabletPanel } from '@/entities/club'
import {
  leagueInfoState,
  useFetchingTeamsDataInLeague,
} from '@/entities/league'
import * as S from './ClubViews.style'

/**
 * 
| 컴포넌트        | mount |   update |    총 렌더링 |
| ----------- | ----: | -------: | -------: |
| `ClubViews` |    1회 |       9회 |      10회 |
| `Club`      |   12회 | 약 39~40회 | 약 51~52회 |

성능에 문제는 없지만 리렌더링 횟수가 많음.
1. club 컴포넌트 메모제이션
2. array 컴포넌트의 index를 id로 변경
> 횟수 변화
 actualDuration < baseDuration
패턴이 반복되는 것은 React가 memo 비교 후 렌더를 skip했다는 의미입니다.
| 컴포넌트        | mount | update | 총 렌더링 |
| ----------- | ----: | -----: | ----: |
| `ClubViews` |    1회 |     6회 |    7회 |
| `Club`      |   10회 |     0회 |   10회 |

* 성능 메모:
 * - Club memo + key 안정화 후 Club의 불필요한 update 렌더를 줄였습니다.
 * - ClubViews는 데이터 상태 변화에 따라 update가 발생하며, 현재 체감 성능 문제는 없습니다.
 */

function ClubViewsError({ refetch }: { refetch: () => void }) {
  return (
    <S.ErrorBox>
      <span>팀 데이터를 불러오지 못했습니다</span>
      <S.RetryButton
        onClick={() => {
          refetch()
        }}
      >
        다시 시도
      </S.RetryButton>
    </S.ErrorBox>
  )
}
const ClubViews = () => {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const { teamIdsQuery, teamDatasQuery } = useFetchingTeamsDataInLeague(
    leagueInfo.id,
  )

  const {
    isTabletOpen,
    showClubGrid,
    showTabletToggle,
    toggleTabletPanel,
    closeTabletPanel,
  } = useClubTabletPanel()
  if (teamIdsQuery.error) {
    return <ClubViewsError refetch={() => teamIdsQuery.refetch()} />
  }

  const isInitialLoading = teamIdsQuery.isPending
  const isAnyTeamLoading = teamDatasQuery.some(q => q.isPending)
  const teamIds = teamIdsQuery.data ?? []

  return (
    <>
      {showTabletToggle && (
        <S.TabletToggleButton
          type='button'
          aria-expanded={isTabletOpen}
          onClick={toggleTabletPanel}
        >
          {isTabletOpen ? '팀 목록 닫기' : '팀 목록 열기'}
        </S.TabletToggleButton>
      )}

      {showClubGrid && (
        <S.ClubContainer $isLoading={isInitialLoading || isAnyTeamLoading}>
          {isInitialLoading
            ? Array.from({ length: 12 }).map((_, idx) => (
                <S.ClubSkeleton key={`skeleton-placeholder-${idx}`} />
              ))
            : teamIds.map((teamId, idx) => {
                const q = teamDatasQuery[idx]
                if (q?.data) {
                  return (
                    <Club
                      key={teamId}
                      {...q.data}
                      offTablet={closeTabletPanel}
                      enableSquadModal
                    />
                  )
                }
                return <S.ClubSkeleton key={`skeleton-${teamId}`} />
              })}
        </S.ClubContainer>
      )}
    </>
  )
}

export default ClubViews
