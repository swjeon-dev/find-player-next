import clsx from 'clsx'

import styles from './ToastUI.module.css'

interface ToastUIProps {
  message: string
  isVisible: boolean
  handleAnimationEnd: () => void
}
export default function ToastUI({
  message,
  isVisible,
  handleAnimationEnd,
}: ToastUIProps) {
  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      role='status'
      aria-live='polite'
      className={clsx(
        styles['toast'],
        styles[isVisible ? 'visible-animation' : 'invisible-animation'],
      )}
    >
      <p className={styles['message']}>{message}</p>
    </div>
  )
}
