/** T: debounce 대상 함수. `never[]`는 모든 함수 타입을 허용하면서 `any[]`보다 추론이 엄격합니다. */
export type DebouncedFunction<T extends (...args: never[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void
}

/** 연속 호출 시 마지막 호출만 delay ms 후 실행합니다. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, delay)
  }) as DebouncedFunction<T>

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}
