import styled from 'styled-components'

const Form = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const InputWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Input = styled.input`
  width: 70%;
  height: 35px;
  border: 1.3px solid #3b3b3b;
  text-align: start;
  font-size: 17px;
  font-weight: bold;
  outline: none;
  padding-left: 10px;
  border-radius: 5px;
  &::placeholder {
    color: #979dac;
  }
  &:disabled {
    background-color: rgba(195, 195, 195, 0.5);
    cursor: not-allowed;
  }
`

export { Form, InputWrap, Input }
