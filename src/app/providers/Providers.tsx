'use client'

import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'styled-components'

import { theme } from '@/shared'

import { queryClient } from './queryClient'
import { setupQueryPersist } from './persistClient'
import { GlobalStyle } from '../styles'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupQueryPersist()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <GlobalStyle />
          {children}
        </RecoilRoot>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
