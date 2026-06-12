import { Providers } from '@/app/providers'
import { Header } from '@/shared/ui/layout'

export const metadata = {
  title: {
    default: 'Find Football Player',
    template: '%s | Find Football Player',
  },
  description: 'Find Football Player',
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
          <header>
            <Header />
          </header>
          <main>{children}</main>
        </Providers>
        <div id='modal-root' />
      </body>
    </html>
  )
}
