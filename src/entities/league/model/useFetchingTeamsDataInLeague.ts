import {
  useQueries,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'

import {
  fetchTeam,
  fetchTeamIdsInLeague,
  queryKeysMain,
  type IFirebaseTeamDetail,
} from '@/shared'

const useFetchingTeamsDataInLeague = (leagueId: number) => {
  const teamIdsQuery = useQuery<number[], Error>({
    queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
    queryFn: () => fetchTeamIdsInLeague(leagueId),
    enabled: !!leagueId,
  })

  const teamDatasQuery = useQueries({
    queries: ((teamIdsQuery.data ?? []) as number[]).map<
      UseQueryOptions<IFirebaseTeamDetail, Error>
    >(teamId => ({
      queryKey: queryKeysMain.teams.detail(teamId),
      queryFn: () => fetchTeam(teamId),
    })),
  })

  return { teamIdsQuery, teamDatasQuery }
}

export default useFetchingTeamsDataInLeague
