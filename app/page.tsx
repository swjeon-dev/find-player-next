import type { Metadata } from 'next'

import { CoverView } from '@/widget'
import { fetchLeagueList } from '@/shared/api'
import { leagueDto } from '@/entities/league/model/leagueDto'

export const metadata: Metadata = {
  title: '홈',
  description: '리그를 선택하고 선수 퀴즈를 시작하세요.',
  keywords: ['홈', '리그', '선수 퀴즈'],
}

export default async function HomePage() {
  const leaguesInfo = await fetchLeagueList().then(leagueDto)

  return <CoverView leaguesInfo={leaguesInfo} />
}
