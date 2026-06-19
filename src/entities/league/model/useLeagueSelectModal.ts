'use client'

import { useRef } from 'react'

import { selectLeagueAction } from '@/entities/league/actions/selectLeagueAction'
import type { ILeagueInfo } from '@common/model'

export default function useLeagueSelectModal() {
  const dialogRef = useRef<HTMLDialogElement>(null)

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
    selectLeagueAction(leagueId)
  }

  return {
    dialogRef,
    openModal,
    closeModal,
    selectLeague,
  }
}
