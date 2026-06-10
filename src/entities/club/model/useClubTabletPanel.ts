import { useCallback, useEffect, useState } from 'react'

import { useBreakpoint } from '@/shared'

// 패널 제어
export const useClubTabletPanel = () => {
  const [isTabletOpen, setIsTabletOpen] = useState(false)
  const { isAtMost, isVirtualKeyboardOpen } = useBreakpoint()
  const isTablet = isAtMost('tablet')
  const showClubGrid = !isTablet || isTabletOpen
  const showTabletToggle = isTablet && !isVirtualKeyboardOpen

  const toggleTabletPanel = useCallback(
    () => setIsTabletOpen(prev => !prev),
    [],
  )
  const closeTabletPanel = useCallback(() => setIsTabletOpen(false), [])

  useEffect(() => {
    if (!isTablet) {
      setIsTabletOpen(false)
    }
  }, [isTablet])

  useEffect(() => {
    if (isVirtualKeyboardOpen) {
      setIsTabletOpen(false)
    }
  }, [isVirtualKeyboardOpen])
  return {
    isTabletOpen,
    showClubGrid,
    showTabletToggle,
    toggleTabletPanel,
    closeTabletPanel,
  }
}

// 반환: { isTabletOpen, showClubGrid, showTabletToggle, toggleTabletPanel, closeTabletPanel }
