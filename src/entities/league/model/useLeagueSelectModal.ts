'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { selectLeagueAction } from '@/entities/league/actions/selectLeagueAction'
import type { LeagueListItem } from './league.constants'

export default function useLeagueSelectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    dialogRef.current?.close()
    setIsOpen(false)
  }, [])

  const selectLeague = useCallback((league: LeagueListItem) => {
    selectLeagueAction(league.id)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
      dialogRef.current.scrollTo({ top: 0 })
    }
  }, [isOpen])

  return {
    isOpen,
    dialogRef,
    openModal,
    closeModal,
    selectLeague,
  }
}
