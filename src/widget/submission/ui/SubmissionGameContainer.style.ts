import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  width: 500px;
  min-height: 300px;
  border-radius: 15px;
  margin-bottom: 50px;

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`
