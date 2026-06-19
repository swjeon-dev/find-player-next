import clsx from 'clsx'

import styles from './FlashToastUI.module.css'

interface FlashToastUIProps {
  message: string
  isVisible: boolean
  handleAnimationEnd: () => void
}

export default function FlashToastUI({
  message,
  isVisible,
  handleAnimationEnd,
}: FlashToastUIProps) {
  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      role='status'
      aria-live='polite'
      className={clsx(
        styles['flash-toast'],
        styles[isVisible ? 'visible-animation' : 'invisible-animation'],
      )}
    >
      <p className={styles['message']}>{message}</p>
    </div>
  )
}
