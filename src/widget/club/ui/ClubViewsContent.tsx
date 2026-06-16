'use client'
import clsx from 'clsx'

import type { IFirebaseTeamDetail } from '@common/model'
import { SkeletonBase } from '@/shared'

import styles from './ClubViews.module.css'
import ClubWithSquadModal from './ClubWithSquadModal'

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
        <button
          className={styles['tablet-toggle-button']}
          type='button'
          aria-expanded={isTabletOpen}
          onClick={toggleTabletPanel}
        >
          {isTabletOpen ? '팀 목록 닫기' : '팀 목록 열기'}
        </button>
      )}

      {showClubGrid && (
        <div
          className={clsx(
            styles['club-container'],
            isInitialLoading || isAnyTeamLoading
              ? styles['loading']
              : styles['not-loading'],
          )}
        >
          {isInitialLoading
            ? Array.from({ length: 12 }).map((_, idx) => (
                <SkeletonBase
                  key={`skeleton-placeholder-${idx}`}
                  className={styles['club-skeleton']}
                />
              ))
            : teamIds.map((teamId, idx) => {
                const teamData = teamDatas?.[idx]
                if (teamData) {
                  return (
                    <ClubWithSquadModal
                      key={teamId}
                      {...teamData}
                      offTablet={closeTabletPanel}
                    />
                  )
                }
                return (
                  <SkeletonBase
                    key={`skeleton-${teamId}`}
                    className={styles['club-skeleton']}
                  />
                )
              })}
        </div>
      )}
    </>
  )
}

export default ClubViewsContent
