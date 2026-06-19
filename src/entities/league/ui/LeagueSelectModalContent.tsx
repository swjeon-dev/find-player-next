'use client'

import type { RefObject } from 'react'
import { createPortal } from 'react-dom'

import usePrefetchLeagueData from '../model/usePrefetchLeagueData'
import LeagueSelectItem from './LeagueSelectItem'
import styles from './LeagueSelectModal.module.css'
import type { ILeagueInfo } from '@common/model'

const MODAL_ROOT_ID = 'modal-root'

function getModalRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.getElementById(MODAL_ROOT_ID)
}

interface LeagueSelectModalContentProps {
  leaguesInfo: ILeagueInfo[]
  isOpen: boolean
  dialogRef: RefObject<HTMLDialogElement | null>
  onClose: () => void
  onSelectLeague: (league: ILeagueInfo) => void
}

export default function LeagueSelectModalContent({
  leaguesInfo,
  isOpen,
  dialogRef,
  onClose,
  onSelectLeague,
}: LeagueSelectModalContentProps) {
  const { prefetchingLeagueData } = usePrefetchLeagueData()

  if (!isOpen) return null

  const modalRoot = getModalRoot()
  if (!modalRoot) return null

  return createPortal(
    <dialog
      className={styles['dialog']}
      ref={dialogRef}
      onMouseDown={e => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onClose={onClose}
    >
      <div className={styles['container']} onClick={e => e.stopPropagation()}>
        <h1 className={styles['title']}>Select League you want</h1>
        <div className={styles['list']}>
          {leaguesInfo.map(league => (
            <LeagueSelectItem
              key={league.id}
              league={league}
              onSelect={onSelectLeague}
              onPrefetch={prefetchingLeagueData}
            />
          ))}
        </div>
      </div>
    </dialog>,
    modalRoot,
  )
}
