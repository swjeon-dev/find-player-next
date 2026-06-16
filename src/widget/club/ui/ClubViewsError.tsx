'use client'

import styles from './ClubViewsError.module.css'

function ClubViewsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles['error-box']} role='alert'>
      <span>팀 데이터를 불러오지 못했습니다</span>
      <button className={styles['retry-button']} onClick={onRetry}>
        다시 시도
      </button>
    </div>
  )
}

export default ClubViewsError
