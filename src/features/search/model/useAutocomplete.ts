'use client'

import { useEffect, useRef, useState } from 'react'
import type { IFirebasePlayer } from '@common/model'

function useAutocompletePaint(
  focusedIndex: number,
  searchingPlayers: IFirebasePlayer[],
) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return
    const el = listRef.current.children[focusedIndex] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [focusedIndex])

  const hasResults = searchingPlayers.length > 0

  return {
    hasResults,
    listRef,
  }
}

function useAutocompleteListFocus(value: string) {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  useEffect(() => {
    setFocusedIndex(-1)
  }, [value])
  return { focusedIndex, setFocusedIndex }
}

export { useAutocompleteListFocus, useAutocompletePaint }
