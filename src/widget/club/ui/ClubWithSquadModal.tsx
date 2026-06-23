'use client'

import { useQueryClient } from '@tanstack/react-query'
import { memo, useEffect, useRef } from 'react'

import {
  Club,
  prefetchTeamPlayersId,
  useClubSquadModalTrigger,
} from '@/entities/club'
import type { IFirebaseTeamDetail } from '@common/model'
import dynamic from 'next/dynamic'

const loadClubSquadModal = () => import('./ClubSquadModal')

const ClubSquadModalLazy = dynamic(loadClubSquadModal, {
  ssr: false,
  loading: () => null,
})

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
    onHover: loadClubSquadModal,
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
        <ClubSquadModalLazy
          teamId={id}
          parentRef={parentRef}
          offModal={handleModalClose}
        />
      )}
    </Club>
  )
}

export default memo(ClubWithSquadModal)
