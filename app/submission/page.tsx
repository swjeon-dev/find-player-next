import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { SubmissionView } from '@/widget'

export const metadata: Metadata = {
  title: '퀴즈',
  description: '선수 퀴즈에 답하고 결과를 확인하세요.',
  keywords: ['퀴즈', '선수'],
}

export default async function SubmissionPage() {
  const leagueId = Number((await cookies()).get('league-id')?.value)

  return <SubmissionView leagueId={leagueId} />
}
