import Link from 'next/link'

import { ROUTER_PATH } from '@/shared'
import styles from './not-found.module.css'

function NotFoundView() {
  return (
    <section className={styles['container']}>
      <div className={styles['card']}>
        <div className={styles['content']}>
          <h1 className={styles['title']}>페이지를 찾을 수 없습니다.</h1>
          <p className={styles['description']}>
            잘못된 페이지 접근입니다. 홈으로 이동해주세요.
          </p>
          <div className={styles['actions']}>
            <Link href={ROUTER_PATH.HOME} className={styles['action-link']}>
              홈으로 이동
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFoundView
