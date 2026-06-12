import type { Metadata } from 'next'

import { SubmissionView } from '@/widget'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '퀴즈',
  description: '선수 퀴즈에 답하고 결과를 확인하세요.',
  keywords: ['퀴즈', '선수'],
}

export default function Submission() {
  return <SubmissionView />
}
