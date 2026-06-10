import styled from 'styled-components'

export const Dialog = styled.dialog`
  width: 80%;
  max-width: 500px;
  height: 280px;
  background-color: #6b7280;
  padding: 0;
  border: none;
  border-radius: 12px;
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
`
export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
`
export const Span = styled.span`
  color: rgb(255, 255, 255);
  font-weight: bold;
`
export const Title = styled(Span)`
  font-size: 1.5rem;
`
export const BoxContainer = styled.div``
export const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  &:hover {
    border: 1px solid white;
    border-radius: 15px;
    cursor: pointer;
  }
`
export const Emblem = styled.img`
  width: 70px;
  height: 70px;
`

export const Button = styled.button`
  border: 1px solid white;
  width: 500px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  border-radius: 15px;
  &:hover {
    cursor: pointer;
  }
  z-index: 1;
  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`

export const ButtonLabel = styled.span`
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin: auto;
`
