'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSetRecoilState } from 'recoil'
import type { StaticImageData } from 'next/image'

import { ROUTER_PATH } from '@/shared'
import { leagueInfoState } from './leagueInfoState'

export interface LeagueListItem {
  name: string
  id: number
  emblem: StaticImageData
}

export default function useLeagueSelectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const setLeagueInfo = useSetRecoilState(leagueInfoState)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    dialogRef.current?.close()
    setIsOpen(false)
  }, [])

  const setLeagueRange = useCallback(
    (league: LeagueListItem) => {
      setLeagueInfo({ id: league.id })
      router.push(ROUTER_PATH.SUBMISSION)
    },
    [router, setLeagueInfo],
  )

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
    setLeagueRange,
  }
}
