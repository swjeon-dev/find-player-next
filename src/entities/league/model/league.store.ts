'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'

interface LeagueInfo {
  id: number
  setId: (id: number) => void
}

const leaguePersistStorage: StateStorage = {
  getItem: name => {
    const raw = sessionStorage.getItem(name)
    if (raw == null) return null

    try {
      const parsed = JSON.parse(raw) as {
        state?: { id?: number }
        id?: number
        leagueInfo?: { id?: number | null }
      }

      if (parsed.state && typeof parsed.state.id === 'number') {
        return raw
      }

      const legacyId =
        typeof parsed.leagueInfo?.id === 'number'
          ? parsed.leagueInfo.id
          : typeof parsed.id === 'number'
            ? parsed.id
            : null

      if (legacyId != null) {
        return JSON.stringify({ state: { id: legacyId }, version: 0 })
      }
    } catch {
      return null
    }

    return null
  },
  setItem: (name, value) => sessionStorage.setItem(name, value),
  removeItem: name => sessionStorage.removeItem(name),
}

export const useLeagueInfoStore = create<LeagueInfo>()(
  persist(
    set => ({
      id: 0,
      setId: id => set({ id }),
    }),
    {
      name: 'leagueInfo',
      storage: createJSONStorage(() => leaguePersistStorage),
      partialize: state => ({ id: state.id }),
      skipHydration: true,
    },
  ),
)

export function useLeagueInfoHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    useLeagueInfoStore.persist.hasHydrated(),
  )

  useEffect(() => {
    const unsub = useLeagueInfoStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    setHydrated(useLeagueInfoStore.persist.hasHydrated())

    return unsub
  }, [])

  return hydrated
}
