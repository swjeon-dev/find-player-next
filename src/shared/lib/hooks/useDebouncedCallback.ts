import { useEffect, useMemo } from 'react'

import { debounce, type DebouncedFunction } from '../debounce'

/** 함수 호출을 지연합니다. hover·prefetch 등 이벤트 핸들러에 사용합니다. */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): DebouncedFunction<T> {
  const debouncedFn = useMemo(() => debounce(fn, delay), [fn, delay])

  useEffect(() => () => debouncedFn.cancel(), [debouncedFn])

  return debouncedFn
}
