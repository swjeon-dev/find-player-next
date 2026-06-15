'use client'

import { Club } from '@/entities/club'

import * as S from './ClubViews.style'
import type { IFirebaseTeamDetail } from '@common/model'

interface IClubViewsContentProps {
  showTabletToggle: boolean
  isTabletOpen: boolean
  toggleTabletPanel: () => void
  showClubGrid: boolean
  isInitialLoading: boolean
  isAnyTeamLoading: boolean
  teamIds: number[]
  teamDatas: (IFirebaseTeamDetail | undefined)[]
  closeTabletPanel: () => void
}

const ClubViewsContent = ({
  showTabletToggle,
  isTabletOpen,
  toggleTabletPanel,
  showClubGrid,
  isInitialLoading,
  isAnyTeamLoading,
  teamIds,
  teamDatas,
  closeTabletPanel,
}: IClubViewsContentProps) => {
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
                const teamData = teamDatas?.[idx]
                if (teamData) {
                  return (
                    <Club
                      key={teamId}
                      {...teamData}
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

export default ClubViewsContent
