'use client'

import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './queryClient'
import { setupQueryPersist } from './persistClient'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupQueryPersist()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <SpeedInsights />
    </QueryClientProvider>
  )
}
