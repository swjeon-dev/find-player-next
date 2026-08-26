'use client'

import styles from './ChangeButton.module.css'

interface ChangeButtonProps {
  onClick: () => void
}

const ChangeButton = ({ onClick }: ChangeButtonProps) => {
  return (
    <button className={styles['alert-button']} onClick={onClick}>
      <span>문제 변경</span>
    </button>
  )
}

export default ChangeButton
