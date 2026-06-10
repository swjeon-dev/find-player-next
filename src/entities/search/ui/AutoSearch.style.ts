import styled, { css } from 'styled-components'

const AutoSearchBox = styled.ul`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 70%;
  max-height: 200px;
  overflow-y: auto;
  color: red;
  margin: 0 auto;
  border: 1.3px solid rgba(59, 59, 59, 0.4);
  background-color: white;
  border-radius: 0 0 5px 5px;
`
const PlayerBox = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 35px;
  font-size: 15px;
  font-weight: bold;
  color: rgba(59, 59, 59, 0.5);

  ${props =>
    props.$selected
      ? css`
          border: 2px solid black;
        `
      : css`
          border-color: transparent;
        `}
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  background-color: white;
  box-shadow: 0px 3px 12px black;
  &:hover {
    cursor: pointer;
  }
`
const ClubEmblem = styled.img`
  width: 25px;
  height: 25px;
`
const Name = styled.span`
  margin: auto 0;
`

export { AutoSearchBox, PlayerBox, ClubEmblem, Name }
