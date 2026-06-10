import { useCallback, useEffect, useMemo, useState } from 'react'

import { breakpoints } from '../../config'

export type BreakpointMatches = {
  readonly mobile: boolean
  readonly tablet: boolean
  readonly desktop: boolean
}

/** `theme.media`와 동일한 max-width 구간을 배타적으로 나눈 값 (컴포넌트 분기용) */
export type BreakpointName = 'mobile' | 'tablet' | 'desktop'

const queries = {
  mobile: `(max-width: ${breakpoints.mobile})`,
  tablet: `(max-width: ${breakpoints.tablet})`,
  desktop: `(max-width: ${breakpoints.desktop})`,
} as const

function parsePx(value: string): number {
  return Number.parseInt(value, 10)
}

function readMatches(): BreakpointMatches {
  if (typeof window === 'undefined') {
    return { mobile: false, tablet: false, desktop: false }
  }
  return {
    mobile: window.matchMedia(queries.mobile).matches,
    tablet: window.matchMedia(queries.tablet).matches,
    desktop: window.matchMedia(queries.desktop).matches,
  }
}

function exclusiveBreakpoint(width: number): BreakpointName {
  const mobileMax = parsePx(breakpoints.mobile)
  const tabletMax = parsePx(breakpoints.tablet)
  // const desktopMax = parsePx(breakpoints.desktop)
  if (width <= mobileMax) return 'mobile'
  if (width <= tabletMax) return 'tablet'
  return 'desktop'
}

/** 모바일 UA에서 visualViewport 높이가 줄어들면 가상 키보드가 열린 것으로 간주 */
const KEYBOARD_HEIGHT_THRESHOLD_PX = 150
const KEYBOARD_HEIGHT_RATIO = 0.15

function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

function readVirtualKeyboardOpen(): boolean {
  if (typeof window === 'undefined') return false
  if (!isMobileUserAgent()) return false

  const visualViewport = window.visualViewport
  if (!visualViewport) return false

  const layoutHeight = window.innerHeight
  const viewportHeight = visualViewport.height
  const threshold = Math.max(
    KEYBOARD_HEIGHT_THRESHOLD_PX,
    layoutHeight * KEYBOARD_HEIGHT_RATIO,
  )

  return layoutHeight - viewportHeight > threshold
}

interface UseBreakpointReturn {
  /** `theme.media`와 같은 의미: 해당 max-width 미디어쿼리가 현재 참인지 */
  matches: BreakpointMatches
  /** 한 구간만 선택 (조건부 렌더 등) */
  breakpoint: BreakpointName
  width: number
  /** 특정 max-width 이하인지 한 번에 확인 */
  isAtMost: (key: keyof typeof breakpoints) => boolean
  /** 모바일에서 가상 키보드가 열려 visualViewport가 줄어든 상태 */
  isVirtualKeyboardOpen: boolean
}

const defaultWidth = typeof window === 'undefined' ? 0 : window.innerWidth

const useBreakpoint = (): UseBreakpointReturn => {
  const [matches, setMatches] = useState<BreakpointMatches>(readMatches)
  const [width, setWidth] = useState(defaultWidth)
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(
    readVirtualKeyboardOpen,
  )

  const sync = useCallback(() => {
    setMatches(readMatches())
    setWidth(typeof window === 'undefined' ? 0 : window.innerWidth)
    setIsVirtualKeyboardOpen(readVirtualKeyboardOpen())
  }, [])

  useEffect(() => {
    sync()

    const mqs = [
      window.matchMedia(queries.mobile),
      window.matchMedia(queries.tablet),
      window.matchMedia(queries.desktop),
    ]

    mqs.forEach(mq => mq.addEventListener('change', sync))
    window.addEventListener('resize', sync)

    const visualViewport = window.visualViewport
    visualViewport?.addEventListener('resize', sync)

    return () => {
      mqs.forEach(mq => mq.removeEventListener('change', sync))
      window.removeEventListener('resize', sync)
      visualViewport?.removeEventListener('resize', sync)
    }
  }, [sync])

  const breakpoint = useMemo(() => exclusiveBreakpoint(width), [width])

  const isAtMost = useCallback(
    (key: keyof typeof breakpoints) => {
      if (key === 'mobile') return matches.mobile
      if (key === 'tablet') return matches.tablet
      return matches.desktop
    },
    [matches],
  )

  return { matches, breakpoint, width, isAtMost, isVirtualKeyboardOpen }
}

export default useBreakpoint
