'use client'

import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { useLeagueInfoStore } from '@/entities/league'
import { queryClient } from './queryClient'
import { setupQueryPersist } from './persistClient'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useLeagueInfoStore.persist.rehydrate()
    setupQueryPersist()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
