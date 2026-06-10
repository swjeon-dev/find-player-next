import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useSetRecoilState } from 'recoil'

import { ROUTER_PATH } from '@/shared'
import {
  fetchPlayerIdsInLeague,
  fetchTeamIdsInLeague,
  queryKeysMain,
  useDebouncedCallback,
} from '@/shared'
import { leagueInfoState } from '../model'

import emblemImage from '/emblem/pl.webp'
import * as S from './LeagueSelectModal.style'

// temp
interface leagueListProps {
  name: string
  id: number
  // season: number
  // webp image
  emblemImage: string
}

const leagueList: leagueListProps[] = [
  {
    name: 'pl',
    id: 39,
    // season: 2024, // 26년 기준 최신
    emblemImage,
  },
]

interface LeagueSelectModalProps {
  children: (handlers: { openModal: () => void }) => React.ReactNode
}

function LeagueSelectModalTrigger() {
  return (
    <LeagueSelectModalContainer>
      {({ openModal }) => (
        <S.Button
          type='button'
          onClick={openModal}
          aria-labelledby='cover-game-heading'
        >
          <S.ButtonLabel>Game Start</S.ButtonLabel>
        </S.Button>
      )}
    </LeagueSelectModalContainer>
  )
}
function LeagueSelectModalContainer({ children }: LeagueSelectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLeagueInfo = useSetRecoilState(leagueInfoState)

  const closeModal = useCallback(() => {
    dialogRef.current?.close()
    setIsOpen(false)
  }, [])

  const setLeagueRange = (league: leagueListProps) => {
    setLeagueInfo({ id: league.id })
    navigate(ROUTER_PATH.SUBMISSION)
  }

  const prefetchLeagueData = useCallback(
    (leagueId: leagueListProps['id']) => {
      const teamsIds = queryClient.getQueryData<number[]>(
        queryKeysMain.teams.idsByLeaguePersisted(leagueId),
      )
      if (!teamsIds?.length) {
        void queryClient.prefetchQuery({
          queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
          queryFn: () => fetchTeamIdsInLeague(leagueId),
        })
      }

      const playersId = queryClient.getQueryData<number[]>(
        queryKeysMain.players.idsByLeaguePersisted(leagueId),
      )
      if (!playersId?.length) {
        void queryClient.prefetchQuery({
          queryKey: queryKeysMain.players.idsByLeaguePersisted(leagueId),
          queryFn: () => fetchPlayerIdsInLeague(leagueId),
        })
      }
    },
    [queryClient],
  )

  const prefetchingLeagueData = useDebouncedCallback(prefetchLeagueData, 200)

  useEffect(() => {
    if (!isOpen) return

    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
      dialogRef.current.scrollTo({ top: 0 })
    }
  }, [isOpen])

  return (
    <>
      {children({ openModal: () => setIsOpen(true) })}
      {isOpen &&
        createPortal(
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
                    onMouseEnter={() => prefetchingLeagueData(league.id)}
                    aria-label={`${league.name} 리그 선택 버튼`}
                  >
                    <S.Emblem
                      src={league.emblemImage}
                      width='70'
                      height='70'
                      alt={`${league.name} emblem image`}
                    />
                    <S.Span>PL</S.Span>
                  </S.Box>
                ))}
              </S.BoxContainer>
            </S.Container>
          </S.Dialog>,
          document.getElementById('modal-root') as HTMLElement,
        )}
    </>
  )
}

export default LeagueSelectModalTrigger
