import styled from 'styled-components'

export const PlayerList = styled.ul<{
  $isTransfer: { y: boolean; x: boolean }
  $isVisible: boolean
}>`
  position: absolute;
  top: 0;
  left: 100%;
  width: 230px;
  max-height: 300px;
  height: fit-content;
  z-index: 3;
  border: 2px solid grey;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow-y: auto;
  visibility: ${props => (props.$isVisible ? 'visible' : 'hidden')};

  transform: ${props => {
    const { x, y } = props.$isTransfer
    const parts: string[] = []
    if (x) parts.push('translateX(-80%)')
    if (y) parts.push('translateY(-80%)')
    return parts.length > 0 ? parts.join(' ') : 'none'
  }};

  animation: ${props =>
    props.$isVisible ? 'slide-in 0.3s ease-in-out' : 'none'};

  @keyframes slide-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
export const PlayerRow = styled.li`
  line-height: 30px;
  text-align: left;
  color: inherit;
  background-color: #ebebeb;

  &:nth-child(2n) {
    background-color: #c0c0c0;
  }
  &:hover {
    text-decoration: underline;
  }
`
export const Name = styled.span`
  margin: auto 0;
  margin-left: 10px;
  font-weight: bold;
  text-shadow: 1px 1px 5px black;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const Loader = styled.li`
  height: 35px;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  background-color: #ebebeb;

  & span {
    color: gray;
    width: 100%;
    font-size: 0.9rem;
    margin-left: 10px;
  }
`
