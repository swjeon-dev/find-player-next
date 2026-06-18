import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import {
  fetchTeamIdsInLeague,
  fetchPlayerIdsInLeague,
  queryKeysMain,
} from '@/shared'
import { SubmissionView } from '@/widget'

export const metadata: Metadata = {
  title: '퀴즈',
  description: '선수 퀴즈에 답하고 결과를 확인하세요.',
  keywords: ['퀴즈', '선수'],
}

export default async function SubmissionPage() {
  const leagueId = Number((await cookies()).get('league-id')?.value)
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
      queryFn: () => fetchTeamIdsInLeague(leagueId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeysMain.players.idsByLeaguePersisted(leagueId),
      queryFn: () => fetchPlayerIdsInLeague(leagueId),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubmissionView leagueId={leagueId} />
    </HydrationBoundary>
  )
}
