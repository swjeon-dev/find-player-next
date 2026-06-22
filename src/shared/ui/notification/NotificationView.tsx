'use client'

import { useNotificationStore } from './notification.store'
import NotificationUI from './NotificationUI'

function NotificationView() {
  const message = useNotificationStore(state => state.message)
  const isVisible = useNotificationStore(state => state.isVisible)
  const clearNotification = useNotificationStore(state => state.clearNotification)

  const handleAnimationEnd = () => {
    if (!isVisible) {
      clearNotification()
    }
  }

  if (!message) return null

  return (
    <NotificationUI
      message={message}
      isVisible={isVisible}
      handleAnimationEnd={handleAnimationEnd}
    />
  )
}

export default NotificationView
