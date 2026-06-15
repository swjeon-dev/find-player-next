'use client'

import { useQueryClient } from '@tanstack/react-query'
import { lazy, memo, Suspense, useEffect, useRef } from 'react'

import {
  Club,
  prefetchTeamPlayersId,
  useClubSquadModalTrigger,
} from '@/entities/club'
import type { IFirebaseTeamDetail } from '@common/model'

const prefetchClubSquadModal = () => import('./ClubSquadModal')
const ClubSquadModalLazy = lazy(() => import('./ClubSquadModal'))

interface ClubWithSquadModalProps extends IFirebaseTeamDetail {
  offTablet: () => void
}

const ClubWithSquadModal = ({
  logo,
  name,
  id,
  offTablet,
}: ClubWithSquadModalProps) => {
  const queryClient = useQueryClient()
  const parentRef = useRef<HTMLImageElement>(null)
  const {
    isHover,
    shouldRenderModal,
    handleMouseEnter,
    handleMouseLeave,
    handleModalClose,
  } = useClubSquadModalTrigger({
    onClose: offTablet,
    onHover: prefetchClubSquadModal,
  })

  useEffect(() => {
    if (!id) return
    prefetchTeamPlayersId(queryClient, { teamId: id })
  }, [id, queryClient])

  return (
    <Club
      logo={logo}
      name={name}
      isActive={isHover}
      emblemRef={parentRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {shouldRenderModal && isHover && (
        <Suspense fallback={null}>
          <ClubSquadModalLazy
            teamId={id}
            parentRef={parentRef}
            offModal={handleModalClose}
          />
        </Suspense>
      )}
    </Club>
  )
}

export default memo(ClubWithSquadModal)
