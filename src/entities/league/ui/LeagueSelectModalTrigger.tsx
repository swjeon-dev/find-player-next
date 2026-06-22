'use client'

import styles from './LeagueSelectModalTrigger.module.css'

interface LeagueSelectModalTriggerProps {
  onOpen: () => void
  disabled: boolean
}

function LeagueSelectModalTrigger({
  onOpen,
  disabled,
}: LeagueSelectModalTriggerProps) {
  return (
    <button
      className={styles['btn']}
      type='button'
      onClick={onOpen}
      disabled={disabled}
      aria-haspopup='dialog'
      aria-label='Game Start'
    >
      <span className={styles['btn-label']}>Game Start</span>
    </button>
  )
}

export default LeagueSelectModalTrigger
