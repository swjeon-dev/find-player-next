'use client'

import { useClubTabletPanel } from '@/entities/club'
import {
  useFetchingTeamsDataInLeague,
  useLeagueInfoStore,
} from '@/entities/league'

import ClubViewsError from './ui/ClubViewsError'
import ClubViewsContent from './ui/ClubViewsContent'

function ClubViews() {
  const leagueId = useLeagueInfoStore(state => state.id)
  const { teamIdsQuery, teamDatasQuery } = useFetchingTeamsDataInLeague(
    leagueId ?? 0,
  )
  const tabletPanel = useClubTabletPanel()

  if (!leagueId) return null

  if (teamIdsQuery.error) {
    return <ClubViewsError onRetry={() => teamIdsQuery.refetch()} />
  }

  const isInitialLoading = teamIdsQuery.isPending
  const isAnyTeamLoading = teamDatasQuery.some(q => q.isPending)
  const teamIds = teamIdsQuery.data ?? []
  const teamDatas = teamDatasQuery.map(q => q.data)

  return (
    <ClubViewsContent
      {...tabletPanel}
      isInitialLoading={isInitialLoading}
      isAnyTeamLoading={isAnyTeamLoading}
      teamIds={teamIds}
      teamDatas={teamDatas}
    />
  )
}

export default ClubViews
