'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchPlayer, queryKeysMain } from '@/shared'
import type { IFirebasePlayer } from '@common/model'

export default function useFetchingPlayerData({
  playerId,
  enabled,
}: {
  playerId: number | null
  enabled: boolean
}) {
  const {
    isPending,
    isFetching,
    error,
    data: player,
    refetch,
  } = useQuery<IFirebasePlayer, Error>({
    queryKey: queryKeysMain.players.one(playerId ?? 0),
    queryFn: () => fetchPlayer(playerId!),
    enabled: enabled && playerId != null,
    placeholderData: keepPreviousData,
  })

  return { isPending, isFetching, error, player, refetch }
}
