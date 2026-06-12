import { Providers } from '@/app'
import { Header } from '@/shared'

export const metadata = {
  title: '%s | Find Football Player',
  description: '%s | Find Football Player',
  keywords: '%s, Find Football Player',
  author: 'up1',
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
      </body>
    </html>
  )
}
