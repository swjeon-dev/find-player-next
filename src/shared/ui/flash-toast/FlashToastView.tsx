'use client'

import { useEffect, useState } from 'react'

import {
  FLASH_TOAST_COOKIE_NAME,
  FLASH_TOAST_MESSAGES,
  type FlashToastReason,
} from '@/shared/config'

import FlashToastUI from './FlashToastUI'

const FLASH_TOAST_VISIBLE_MS = 2500

function getCookie(name: string): string | null {
  const prefix = `${name}=`
  const entry = document.cookie.split('; ').find(row => row.startsWith(prefix))
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

function resolveMessage(raw: string): string {
  if (raw in FLASH_TOAST_MESSAGES) {
    return FLASH_TOAST_MESSAGES[raw as FlashToastReason]
  }

  return raw
}

function FlashToastView() {
  const [message, setMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const raw = getCookie(FLASH_TOAST_COOKIE_NAME)
    if (!raw) return

    setMessage(resolveMessage(raw))
    deleteCookie(FLASH_TOAST_COOKIE_NAME)

    const timer = setTimeout(() => setIsVisible(false), FLASH_TOAST_VISIBLE_MS)

    return () => clearTimeout(timer)
  }, [])

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setMessage(null)
    }
  }

  if (!message) return null

  return (
    <FlashToastUI
      message={message}
      isVisible={isVisible}
      handleAnimationEnd={handleAnimationEnd}
    />
  )
}

export default FlashToastView
