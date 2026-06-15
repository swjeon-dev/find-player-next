'use client'

import type { RefObject } from 'react'

import * as S from './LeagueSelectModal.style'
import type { LeagueListItem } from '../model/useLeagueSelectModal'
import { plImage } from '../assets'

const leagueList: LeagueListItem[] = [
  {
    name: 'pl',
    id: 39,
    emblem: plImage,
  },
]

interface LeagueSelectModalContentProps {
  dialogRef: RefObject<HTMLDialogElement | null>
  closeModal: () => void
  setLeagueRange: (league: LeagueListItem) => void
  onPrefetch: (leagueId: number) => void
}

export default function LeagueSelectModalContent({
  dialogRef,
  closeModal,
  setLeagueRange,
  onPrefetch,
}: LeagueSelectModalContentProps) {
  return (
    <S.Dialog
      ref={dialogRef}
      onMouseDown={e => {
        if (e.target === e.currentTarget) {
          closeModal()
        }
      }}
      onClose={closeModal}
    >
      <S.Container onClick={e => e.stopPropagation()}>
        <S.Title>Select League you want</S.Title>
        <S.BoxContainer>
          {leagueList.map(league => (
            <S.Box
              key={`league-${league.name}`}
              onClick={() => setLeagueRange(league)}
              onMouseEnter={() => onPrefetch(league.id)}
              aria-label={`${league.name} 리그 선택 버튼`}
            >
              <S.Emblem
                src={league.emblem.src}
                width='70'
                height='70'
                alt={`${league.name} emblem image`}
              />
              <S.Span>PL</S.Span>
            </S.Box>
          ))}
        </S.BoxContainer>
      </S.Container>
    </S.Dialog>
  )
}
