'use client'

import { unstable_rethrow } from 'next/navigation'
import { useRef, useTransition } from 'react'

import { selectLeagueAction } from '@/entities/league/actions/selectLeagueAction'
import { showNotificationReason } from '@/shared'
import type { ILeagueInfo } from '@common/model'

export default function useLeagueSelectModal() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isSelecting, startTransition] = useTransition()

  const openModal = () => {
    if (!dialogRef.current) return
    dialogRef.current.showModal()
    dialogRef.current.scrollTo({ top: 0 })
  }

  const closeModal = () => {
    if (!dialogRef.current) return
    dialogRef.current.close()
  }

  const selectLeague = (leagueId: ILeagueInfo['id']) => {
    startTransition(async () => {
      try {
        const result = await selectLeagueAction(leagueId)
        if (!result.ok) {
          closeModal()
          showNotificationReason(result.reason)
        }
      } catch (error) {
        unstable_rethrow(error)
      }
    })
  }

  return {
    dialogRef,
    openModal,
    closeModal,
    selectLeague,
    isSelecting,
  }
}
