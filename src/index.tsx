import { StrictMode } from 'react'
import { ThemeProvider } from 'styled-components'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'

import {
  AppRouterProvider,
  GlobalStyle,
  queryClient,
  setupQueryPersist,
} from '@/app'
import { theme } from '@/shared'

setupQueryPersist()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <RecoilRoot>
            <AppRouterProvider />
            <GlobalStyle />
          </RecoilRoot>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>,
)
