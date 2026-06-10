import styled from 'styled-components'

interface ChangeButtonProps {
  onClick: () => void
}

export const AlertButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;

  font-size: 15px;
  background: rgb(65 105 225 / 62%);
  box-shadow: 0 2px #4169e1;
  color: white;
  padding: 0.5em 0.8em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
`

const ChangeButton = ({ onClick }: ChangeButtonProps) => {
  return (
    <AlertButton onClick={onClick}>
      <span>문제 변경</span>
    </AlertButton>
  )
}

export default ChangeButton
