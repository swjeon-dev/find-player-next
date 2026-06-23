'use client'

import { ErrorView } from '@/widget/route-state'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorView onRetry={reset} />
}
