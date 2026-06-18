'use client'

import { useEffect, useState } from 'react'

import {
  TOAST_COOKIE_NAME,
  TOAST_MESSAGES,
  type ToastReason,
} from '@/shared/config'

import ToastUI from './ui/ToastUI'

const TOAST_VISIBLE_MS = 2500

function getCookie(name: string): string | null {
  const prefix = `${name}=`
  const entry = document.cookie.split('; ').find(row => row.startsWith(prefix))
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

function resolveMessage(raw: string): string {
  if (raw in TOAST_MESSAGES) {
    return TOAST_MESSAGES[raw as ToastReason]
  }

  return raw
}

function ToastView() {
  const [message, setMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const raw = getCookie(TOAST_COOKIE_NAME)
    if (!raw) return

    setMessage(resolveMessage(raw))
    deleteCookie(TOAST_COOKIE_NAME)

    const timer = setTimeout(() => setIsVisible(false), TOAST_VISIBLE_MS)

    return () => clearTimeout(timer)
  }, [])

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setMessage(null)
    }
  }

  if (!message) return null

  return (
    <ToastUI
      message={message}
      isVisible={isVisible}
      handleAnimationEnd={handleAnimationEnd}
    />
  )
}

export default ToastView
