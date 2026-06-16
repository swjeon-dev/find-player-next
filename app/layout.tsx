import '@/app/styles'

import type { Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Header } from '@/shared/ui/layout'

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
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>

        <div id='modal-root' />
      </body>
    </html>
  )
}
