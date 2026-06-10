import styled from 'styled-components'
import { Container } from './SubmissionGameContainer.style'

interface SubmissionLoaderProps {
  message: string
  onRetry?: () => void
}

const LoadingWrapper = styled(Container)`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  background-color: skyblue;
  border-radius: 15px;
  padding: 10px 20px;

  & div {
    margin-bottom: 15px;
  }

  & span {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3rem;
    color: white;
  }
`
export const RetryButton = styled.button`
  margin-top: 14px;
  font-size: 16px;
  background: rgb(255 255 255 / 92%);
  color: #1a1a1a;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
`

export const SubmissionLoader = ({
  message,
  onRetry,
}: SubmissionLoaderProps) => {
  return (
    // 해당 컴포넌트는 퀴즈가 나오기전 오류가 발생할 때 노출되는 컴포넌트이므로 alert 역할을 합니다.
    <LoadingWrapper role='alert'>
      <div>
        <span>{message}</span>
        {onRetry ? (
          <RetryButton onClick={onRetry}>다시 시도</RetryButton>
        ) : null}
      </div>
    </LoadingWrapper>
  )
}
