import clsx from 'clsx'

import styles from './NotificationUI.module.css'

interface NotificationUIProps {
  message: string
  isVisible: boolean
  handleAnimationEnd: () => void
}

export default function NotificationUI({
  message,
  isVisible,
  handleAnimationEnd,
}: NotificationUIProps) {
  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      role='status'
      aria-live='polite'
      className={clsx(
        styles['notification'],
        styles[isVisible ? 'visible-animation' : 'invisible-animation'],
      )}
    >
      <p className={styles['message']}>{message}</p>
    </div>
  )
}
