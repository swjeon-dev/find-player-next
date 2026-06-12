import { Providers, StyledComponentsRegistry } from '@/app/providers'
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
