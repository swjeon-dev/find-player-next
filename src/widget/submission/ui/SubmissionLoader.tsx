'use client'

import styles from './SubmissionLoader.module.css'

interface SubmissionLoaderProps {
  message: string
  onRetry?: () => void
}

export const SubmissionLoader = ({
  message,
  onRetry,
}: SubmissionLoaderProps) => {
  return (
    // 해당 컴포넌트는 퀴즈가 나오기전 오류가 발생할 때 노출되는 컴포넌트이므로 alert 역할을 합니다.
    <div className={styles['container']} role='alert'>
      <div>
        <span>{message}</span>
        {onRetry ? (
          <button className={styles['retry-button']} onClick={onRetry}>
            다시 시도
          </button>
        ) : null}
      </div>
    </div>
  )
}
