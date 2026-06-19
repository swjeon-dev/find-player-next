'use client'

import {
  NOTIFICATION_MESSAGES,
  type NotificationReason,
} from '@/shared/config/notification'

import { useNotificationStore } from './notification.store'

export function showNotification(message: string) {
  useNotificationStore.getState().showNotification(message)
}

export function showNotificationReason(reason: NotificationReason) {
  showNotification(NOTIFICATION_MESSAGES[reason])
}
