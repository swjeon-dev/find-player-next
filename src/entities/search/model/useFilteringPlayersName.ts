import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchFilteringPlayersByName,
  queryKeysMain,
  type FilteringPlayersByNameRaw,
} from '@/shared'
import type { IFirebasePlayer } from '@common/model'

const MIN_QUERY_LEN = 2
const LIMIT = 20

type UseFilteringPlayersNameArgs = {
  debouncedValue: string
}

export function useFilteringPlayersName({
  debouncedValue,
}: UseFilteringPlayersNameArgs) {
  const queryClient = useQueryClient()
  const trimmed = debouncedValue.trim()
  const enabled = trimmed.length >= MIN_QUERY_LEN
  const queryKey = queryKeysMain.players.filteringByName(trimmed)

  // Helper: Capitalize first letter of each non-empty word
  const capitalizeWords = (str: string) =>
    str
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  const { data, isPending, isFetching } = useQuery<
    FilteringPlayersByNameRaw,
    Error,
    IFirebasePlayer[]
  >({
    queryKey,
    queryFn: async () => {
      // Capitalize each word's first letter for space-separated queries
      const capitalizedValue = capitalizeWords(trimmed)
      return fetchFilteringPlayersByName({
        limit: LIMIT,
        capitalizedValue,
      })
    },
    select: raw => {
      if (raw == null || typeof raw !== 'object') return []
      return Object.values(raw).map(node => node.info)
    },
    enabled,
    staleTime: 30_000,
  })

  const resetPlayers = useCallback(() => {
    queryClient.setQueryData<FilteringPlayersByNameRaw>(queryKey, {})
  }, [queryClient, queryKey])

  const searchingPlayers: IFirebasePlayer[] = enabled ? (data ?? []) : []

  return {
    searchingPlayers,
    resetPlayers,
    isPending: enabled && (isPending || isFetching),
  }
}
