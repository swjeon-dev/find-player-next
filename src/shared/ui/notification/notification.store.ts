'use client'

import { create } from 'zustand'

export const NOTIFICATION_VISIBLE_MS = 2500

interface NotificationStore {
  message: string | null
  isVisible: boolean
  showNotification: (message: string) => void
  hideNotification: () => void
  clearNotification: () => void
}

let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

export const useNotificationStore = create<NotificationStore>(set => ({
  message: null,
  isVisible: false,

  showNotification: message => {
    clearHideTimer()
    set({ message, isVisible: true })

    hideTimer = setTimeout(() => {
      set({ isVisible: false })
      hideTimer = null
    }, NOTIFICATION_VISIBLE_MS)
  },

  hideNotification: () => {
    clearHideTimer()
    set({ isVisible: false })
  },

  clearNotification: () => {
    clearHideTimer()
    set({ message: null, isVisible: false })
  },
}))
