import { useQuery } from '@tanstack/react-query'

import { fetchPlayer, queryKeysMain, type IFirebasePlayer } from '@/shared'

export default function useFetchingPlayerData({
  playerId,
  enabled,
}: {
  playerId: number
  enabled: boolean
}) {
  const {
    isPending,
    isFetching,
    error,
    data: player,
    refetch,
  } = useQuery<IFirebasePlayer, Error>({
    queryKey: queryKeysMain.players.one(playerId),
    queryFn: () => fetchPlayer(playerId),
    enabled,
  })

  return { isPending, isFetching, error, player, refetch }
}
