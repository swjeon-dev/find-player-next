import type { Metadata } from 'next'

import { fetchLeaguesInfoServer } from '@/entities/league/model/leagueList.server'
import { CoverView } from '@/widget/home'
import type { ILeagueInfo } from '@common/model'

export const metadata: Metadata = {
  // title template 사용
  description: '리그를 선택하고 선수 퀴즈를 시작하세요.',
  keywords: ['홈', '리그', '선수 퀴즈'],
}

export default async function HomePage() {
  let leaguesInfo: ILeagueInfo[] = []

  try {
    leaguesInfo = await fetchLeaguesInfoServer()
  } catch {
    leaguesInfo = []
  }

  return <CoverView leaguesInfo={leaguesInfo} />
}
