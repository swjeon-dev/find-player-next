import type { Metadata } from 'next'

import { Providers, StyledComponentsRegistry } from '@/app/providers'
import { Header } from '@/shared'

export const metadata: Metadata = {
  title: {
    default: 'Find Football Player',
    template: '%s | Find Football Player',
  },
  description: '리그를 선택하고 선수 퀴즈를 즐겨보세요.',
  keywords: ['Find Football Player', '축구', '선수 퀴즈'],
  authors: [{ name: 'up1' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        {/* SSR 시 styled-components CSS를 <head>에 넣기 위한 래퍼 */}
        <StyledComponentsRegistry>
          <Providers>
            <header>
              <Header />
            </header>
            <main>{children}</main>
          </Providers>
        </StyledComponentsRegistry>
        <div id='modal-root' />
      </body>
    </html>
  )
}
