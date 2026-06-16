'use client'

import styles from './LeagueSelectModalTrigger.module.css'

export default function LeagueSelectModalTrigger({
  openModal,
}: {
  openModal: () => void
}) {
  return (
    <button
      className={styles['btn']}
      type='button'
      onClick={openModal}
      aria-labelledby='cover-game-heading'
    >
      <span className={styles['btn-label']}>Game Start</span>
    </button>
  )
}
