import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'

import { fetchPlayer, fetchTeamPlayerIds, queryKeysMain } from '@/shared'
import type { IFirebasePlayer } from '@common/model'

function prefetchTeamPlayersId(
  queryClient: QueryClient,
  { teamId }: { teamId: number },
) {
  if (!teamId) return
  const playersId = queryClient.getQueryData<number[] | undefined>(
    queryKeysMain.players.idsByTeam(teamId),
  )
  if (playersId?.length) return

  queryClient.prefetchQuery<number[], Error>({
    queryKey: queryKeysMain.players.idsByTeam(teamId),
    queryFn: () => fetchTeamPlayerIds(teamId),
  })
}

// 48 웨햄, 50 맨시티 선수 목록 조회 실패 확인
const useFetchingTeamPlayersData = (teamId: number) => {
  const queryClient = useQueryClient()

  const {
    isPending,
    error,
    data: playerInTeam,
  } = useQuery<IFirebasePlayer[], Error>({
    queryKey: queryKeysMain.players.byTeam(teamId),
    queryFn: async () => {
      if (!teamId) return []

      const playerIds = await queryClient.ensureQueryData<number[], Error>({
        queryKey: queryKeysMain.players.idsByTeam(teamId),
        queryFn: () => fetchTeamPlayerIds(teamId),
      })

      return Promise.all(playerIds.map(id => fetchPlayer(id)))
    },
  })

  return { isPending, error, playerInTeam }
}

export { useFetchingTeamPlayersData, prefetchTeamPlayersId }
