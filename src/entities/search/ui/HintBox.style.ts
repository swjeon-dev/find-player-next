import styled from 'styled-components'

const HintList = styled.ul`
  margin-bottom: 40px;
`
const HintItem = styled.li`
  margin-top: 60px;

  /* 분리해서 에니메이션 적용 */
  animation: fadeIn 0.5s ease-in-out forwards;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-5%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`
const MyAnswer = styled.h3`
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
`
const Hint = styled.div<{ $isEqual: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border: 2px solid white;
  border-radius: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  font-weight: bold;
  background-color: ${props => (props.$isEqual ? '#06d6a0' : '#8b8c89')};
`
const Label = styled.label`
  position: absolute;
  margin-top: 10px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;

  padding: 5px 10px;
  border-radius: 10px;
  color: black;
  background-color: white;
  box-shadow: 0px 2px 5px #8b8c89;

  display: flex;
  align-items: center;
  & span {
    font-size: small;
  }
`

const ClubEmblem = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
`

export { HintList, HintItem, MyAnswer, Row, Hint, Label, ClubEmblem }
