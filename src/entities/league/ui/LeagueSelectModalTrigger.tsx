'use client'

import styles from './LeagueSelectModalTrigger.module.css'

interface LeagueSelectModalTriggerProps {
  onOpen: () => void
}

function LeagueSelectModalTrigger({ onOpen }: LeagueSelectModalTriggerProps) {
  return (
    <button
      className={styles['btn']}
      type='button'
      onClick={onOpen}
      aria-labelledby='cover-game-heading'
    >
      <span className={styles['btn-label']}>Game Start</span>
    </button>
  )
}

export default LeagueSelectModalTrigger
