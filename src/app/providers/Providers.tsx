'use client'

import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'

import { queryClient } from './queryClient'
import { setupQueryPersist } from './persistClient'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupQueryPersist()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>{children}</RecoilRoot>
    </QueryClientProvider>
  )
}
