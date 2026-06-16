'use client'

import type { RefObject } from 'react'

import styles from './LeagueSelectModal.module.css'
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
    <dialog
      className={styles['dialog']}
      ref={dialogRef}
      onMouseDown={e => {
        if (e.target === e.currentTarget) {
          closeModal()
        }
      }}
      onClose={closeModal}
    >
      <div className={styles['container']} onClick={e => e.stopPropagation()}>
        <h1 className={styles['title']}>Select League you want</h1>
        <div>
          {leagueList.map(league => (
            <div
              className={styles['box']}
              key={`league-${league.name}`}
              onClick={() => setLeagueRange(league)}
              onMouseEnter={() => onPrefetch(league.id)}
              aria-label={`${league.name} 리그 선택 버튼`}
            >
              <img
                className={styles['emblem']}
                src={league.emblem.src}
                width='70'
                height='70'
                alt={`${league.name} emblem image`}
              />
              <span className={styles['text']}>PL</span>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  )
}
