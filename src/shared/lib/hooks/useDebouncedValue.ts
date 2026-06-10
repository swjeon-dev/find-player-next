import { useEffect, useState } from 'react'

/** 값 변경을 지연해 반환합니다. 입력값·hover 상태 등에 사용합니다. */
function useDebouncedValue<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(prev => (Object.is(prev, value) ? prev : value))
    }, ms)

    return () => clearTimeout(timer)
  }, [value, ms])

  return debouncedValue
}

export default useDebouncedValue
