import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchPlayerIdsInLeague, queryKeysMain } from '@/shared'

const useFetchingPlayersIdInLeague = ({ leagueId }: { leagueId: number }) => {
  const queryClient = useQueryClient()

  const {
    isPending,
    error,
    data: playersId,
    dataUpdatedAt,
    refetch,
  } = useQuery<number[], Error>({
    queryKey: queryKeysMain.players.idsByLeaguePersisted(leagueId),
    queryFn: () => fetchPlayerIdsInLeague(leagueId),
    enabled: !!leagueId,
  })

  useEffect(() => {
    if (!leagueId) return
    if (!Array.isArray(playersId) || playersId.length === 0) return
    queryClient.invalidateQueries({
      queryKey: queryKeysMain.players.byLeague(leagueId),
    })
  }, [leagueId, playersId, queryClient])

  return { isPending, error, playersId, refetch, dataUpdatedAt }
}

export default useFetchingPlayersIdInLeague
