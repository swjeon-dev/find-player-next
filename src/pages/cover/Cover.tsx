import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'

import { LeagueSelectModalTrigger } from '@/entities'

const CoverSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SectionHeading = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Cover = () => {
  return (
    <>
      <Helmet>
        <title>Find Football Player</title>
        <meta name='description' content='Home | Find Football Player' />
        <meta name='keywords' content='Find Football Player' />
        <meta name='author' content='up1' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
      </Helmet>

      <CoverSection aria-labelledby='cover-game-heading'>
        <SectionHeading id='cover-game-heading'>Game Start</SectionHeading>
        <LeagueSelectModalTrigger />
      </CoverSection>
    </>
  )
}

export default Cover
