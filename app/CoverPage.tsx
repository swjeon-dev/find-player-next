'use client'

import styled from 'styled-components'

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

function CoverPage() {
  return (
    <CoverSection aria-labelledby='cover-game-heading'>
      <SectionHeading id='cover-game-heading'>Game Start</SectionHeading>
      <LeagueSelectModalTrigger />
    </CoverSection>
  )
}

export default CoverPage
