'use client'

import { memo, useRef } from 'react'
import clsx from 'clsx'

import {
  useFetchingTeamPlayersData,
  useModalPosition,
  useSelectPlayer,
} from '@/entities/club'
import styles from './ClubSquadModal.module.css'

function Message({ message }: { message: string }) {
  return (
    <li className={styles['loader']}>
      <span>{message}</span>
    </li>
  )
}

const Player = memo(function ({
  name,
  handleClick,
}: {
  name: string
  handleClick: (name: string) => void
}) {
  return (
    <li className={styles['player-row']} onClick={() => handleClick(name)}>
      <span className={styles['name']}>{name}</span>
    </li>
  )
})

interface IClubSquadModalProps {
  teamId: number
  parentRef: React.RefObject<HTMLImageElement | null>
  offModal: () => void
}

const ClubSquadModal = ({
  teamId,
  parentRef,
  offModal,
}: IClubSquadModalProps) => {
  const {
    isPending,
    error,
    playerInTeam: players,
  } = useFetchingTeamPlayersData(teamId)
  const listRef = useRef<HTMLUListElement>(null)

  const {
    isReady,
    isTransfer: { x, y },
  } = useModalPosition({
    listRef,
    parentRef,
    triggerKey: teamId,
  })

  const handleClick = useSelectPlayer(offModal)

  return (
    <>
      <ul
        className={clsx(
          styles['player-list'],
          isReady ? styles['visible'] : styles['hidden'],
          x && y
            ? styles['translate-xy']
            : x
              ? styles['translate-x']
              : y
                ? styles['translate-y']
                : styles['translate-none'],
        )}
        ref={listRef}
      >
        {isPending ? (
          <Message message='Loading...' />
        ) : error || !players?.length ? (
          <Message message='현재 선수 목록을 가져올 수 없습니다' />
        ) : (
          players.map(player => (
            <Player
              key={player.id}
              name={player.name}
              handleClick={handleClick}
            />
          ))
        )}
      </ul>
    </>
  )
}

export default ClubSquadModal
