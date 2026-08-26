'use client'

import { useEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'

import usePrefetchLeagueData from '../model/usePrefetchLeagueData'
import LeagueSelectItem from './LeagueSelectItem'
import styles from './LeagueSelectModal.module.css'
import type { ILeagueInfo } from '@common/model'

const MODAL_ROOT_ID = 'modal-root'

interface LeagueSelectModalContentProps {
  leaguesInfo: ILeagueInfo[]
  dialogRef: RefObject<HTMLDialogElement | null>
  onClose: () => void
  onSelectLeague: (leagueId: ILeagueInfo['id']) => void
}

export default function LeagueSelectModalContent({
  leaguesInfo,
  dialogRef,
  onClose,
  onSelectLeague,
}: LeagueSelectModalContentProps) {
  const [mounted, setMounted] = useState(false)
  const { prefetchingLeagueData } = usePrefetchLeagueData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const modalRoot = document.getElementById(MODAL_ROOT_ID)
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
