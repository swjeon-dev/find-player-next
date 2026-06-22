'use client'

import Link from 'next/link'

import { ROUTER_PATH } from '@/shared'

import styles from './route-state.module.css'

interface ErrorViewProps {
  onRetry: () => void
}

function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <section className={styles['container']} aria-labelledby='route-error-heading'>
      <div className={styles['card']}>
        <div className={styles['content']}>
          <h1 className={styles['title']} id='route-error-heading'>
            문제가 발생했습니다
          </h1>
          <p className={styles['description']}>
            일시적인 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해 주세요.
          </p>
          <div className={styles['actions']}>
            <button
              type='button'
              className={styles['action-button']}
              onClick={onRetry}
            >
              다시 시도
            </button>
            <Link href={ROUTER_PATH.HOME} className={styles['action-link']}>
              홈으로 이동
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ErrorView
