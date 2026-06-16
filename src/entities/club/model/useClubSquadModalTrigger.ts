'use client'

import { useCallback, useState } from 'react'

import { useDebouncedValue } from '@/shared'

interface UseClubSquadModalTriggerParams {
  onClose: () => void
  onHover?: () => void
}

export const useClubSquadModalTrigger = ({
  onClose,
  onHover,
}: UseClubSquadModalTriggerParams) => {
  const [isHover, setIsHover] = useState(false)
  const [clicked, setClicked] = useState(false)
  const shouldRenderModal = useDebouncedValue(isHover, 300)

  const handleMouseEnter = useCallback(() => {
    if (clicked) return
    setIsHover(true)
    onHover?.()
  }, [clicked, onHover])

  const handleMouseLeave = useCallback(() => {
    setClicked(false)
    setIsHover(false)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsHover(false)
    setClicked(true)
    onClose()
  }, [onClose])

  return {
    isHover,
    shouldRenderModal,
    handleMouseEnter,
    handleMouseLeave,
    handleModalClose,
  }
}
