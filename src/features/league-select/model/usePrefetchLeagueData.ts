'use client'
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  queryKeysMain,
  useDebouncedCallback,
  fetchTeamIdsInLeague,
  fetchPlayerIdsInLeague,
} from '@/shared'

export default function usePrefetchLeagueData() {
  const queryClient = useQueryClient()
  const prefetchLeagueData = useCallback(
    (leagueId: number) => {
      const teamsIds = queryClient.getQueryData<number[]>(
        queryKeysMain.teams.idsByLeaguePersisted(leagueId),
      )
      if (!teamsIds?.length) {
        void queryClient.prefetchQuery({
          queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
          queryFn: () => fetchTeamIdsInLeague(leagueId),
        })
      }

      const playersId = queryClient.getQueryData<number[]>(
        queryKeysMain.players.idsByLeaguePersisted(leagueId),
      )
      if (!playersId?.length) {
        void queryClient.prefetchQuery({
          queryKey: queryKeysMain.players.idsByLeaguePersisted(leagueId),
          queryFn: () => fetchPlayerIdsInLeague(leagueId),
        })
      }
    },
    [queryClient],
  )

  const prefetchingLeagueData = useDebouncedCallback(prefetchLeagueData, 200)

  return { prefetchingLeagueData }
}
