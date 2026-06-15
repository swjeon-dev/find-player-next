'use client'

import { memo } from 'react'

import * as S from './Club.style'

interface ClubProps {
  logo: string
  name: string
  isActive?: boolean
  emblemRef?: React.RefObject<HTMLImageElement | null>
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children?: React.ReactNode
}

const Club = ({
  logo,
  name,
  isActive = false,
  emblemRef,
  onMouseEnter,
  onMouseLeave,
  children,
}: ClubProps) => {
  return (
    <S.Container
      $isActive={isActive}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <S.Emblem src={logo} alt={name} ref={emblemRef} width='60' height='60' />
      {children}
    </S.Container>
  )
}

export default memo(Club)
