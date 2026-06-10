import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import Header from './Header'

const Container = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1280px;
  gap: 15px;
  margin: 0 auto;
  padding: 0 20px;
  ${({ theme }) => theme.media.tablet} {
    width: 100%;
  }
`

function RootLayout() {
  return (
    <>
      <Helmet>
        <title>Find Football Player</title>
      </Helmet>
      <header>
        <Header />
      </header>
      <main id='main-content'>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  )
}
export default RootLayout
