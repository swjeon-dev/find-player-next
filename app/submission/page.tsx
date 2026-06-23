import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { fetchLeaguesInfoServer } from '@/entities/league/model/leagueList.server'
import { SubmissionView } from '@/widget/submission'

export async function generateMetadata(): Promise<Metadata> {
  const leagueId = Number((await cookies()).get('league-id')?.value)
  const leaguesInfo = await fetchLeaguesInfoServer()
  const league = leaguesInfo.find(item => item.id === leagueId)

  return {
    title: league?.name ?? '퀴즈',
    description: '선수 퀴즈에 답하고 결과를 확인하세요.',
    keywords: ['퀴즈', '선수', league?.name].filter(Boolean) as string[],
  }
}

export default async function SubmissionPage() {
  const leagueId = Number((await cookies()).get('league-id')?.value)

  return <SubmissionView leagueId={leagueId} />
}
