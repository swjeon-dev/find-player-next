'use client'

import { useRecoilValue } from 'recoil'

import { useClubTabletPanel } from '@/entities/club'
import {
  leagueInfoState,
  useFetchingTeamsDataInLeague,
} from '@/entities/league'

import ClubViewsError from './ui/ClubViewsError'
import ClubViewsContent from './ui/ClubViewsContent'

function ClubViews() {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const { teamIdsQuery, teamDatasQuery } = useFetchingTeamsDataInLeague(
    leagueInfo.id ?? 0,
  )
  const tabletPanel = useClubTabletPanel()

  if (!leagueInfo.id) return null

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
