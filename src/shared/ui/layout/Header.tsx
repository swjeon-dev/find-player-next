import { useBreakpoint } from '@/shared'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px auto;
`
const SubContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30%;
  background-color: #f9c74f;
  font-size: 16px;
`

const Text = styled.span`
  margin: auto;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  padding: 5px 10px;
  font-weight: bold;
`

const OriginalLabel = styled.span`
  color: #000000;
  font-weight: bold;
`
const ReferenceLink = styled.a`
  color: #001d3d;
  font-weight: bold;
  text-decoration: underline;

  &:hover {
    opacity: 0.85;
  }
`

const TitleHeading = styled.h1`
  margin: 0;
  padding: 10px 0;
  font-size: inherit;
  font-weight: inherit;
  text-align: center;
`

const HomeLink = styled(Link)<{ $isTablet: boolean }>`
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  text-align: center;
  font-size: ${({ $isTablet }) => (!$isTablet ? '40px' : '25px')};
`

const Header = () => {
  const { isAtMost } = useBreakpoint()
  const isTablet = isAtMost('tablet')

  return (
    <Container>
      <TitleHeading>
        <HomeLink to='/' $isTablet={isTablet}>
          Find Football Player
        </HomeLink>
      </TitleHeading>
      <SubContainer>
        <Text>
          <OriginalLabel>original: </OriginalLabel>
          <ReferenceLink
            href='https://playfootball.games/who-are-ya/big-4/'
            target='_blank'
          >
            https://playfootball.games/who-are-ya/big-4/
          </ReferenceLink>
        </Text>
      </SubContainer>
    </Container>
  )
}

export default Header
