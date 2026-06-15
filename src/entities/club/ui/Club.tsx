'use client'

import { useQueryClient } from '@tanstack/react-query'
import { lazy, memo, Suspense, useEffect, useRef } from 'react'

import { useClubSquadModalTrigger, prefetchTeamPlayersId } from '../model'
import type { IFirebaseTeamDetail } from '@common/model'
import * as S from './Club.style'

const ClubSquadModalLazy = lazy(() => import('@/widget/club/ui/ClubSquadModal'))
const prefetchClubSquadModal = () => {
  import('@/widget/club/ui/ClubSquadModal')
}

interface ClubProps extends IFirebaseTeamDetail {
  offTablet: () => void
  enableSquadModal?: boolean
}

const Club = ({
  logo,
  name,
  id,
  offTablet,
  enableSquadModal = false,
}: ClubProps) => {
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
    ...(enableSquadModal && { onHover: prefetchClubSquadModal }),
  })

  useEffect(() => {
    if (!id) return
    prefetchTeamPlayersId(queryClient, { teamId: id })
  }, [id, queryClient])

  return (
    <>
      <S.Container
        $isActive={enableSquadModal && isHover}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <S.Emblem
          src={logo}
          alt={name}
          ref={parentRef}
          width='60'
          height='60'
        />
        {enableSquadModal && shouldRenderModal && isHover && (
          <Suspense fallback={null}>
            <ClubSquadModalLazy
              teamId={id}
              parentRef={parentRef}
              offModal={handleModalClose}
            />
          </Suspense>
        )}
      </S.Container>
    </>
  )
}

export default memo(Club)
