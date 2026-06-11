import { Navigate, Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { ROUTER_PATH } from '@/shared'
import { leagueInfoState } from '@/entities/league'

function ProtectedRoute() {
  const leagueInfo = useRecoilValue(leagueInfoState)

  if (process.env.NEXT_PUBLIC_LHCI === 'true') {
    return <Outlet />
  }

  if (!leagueInfo.id) {
    alert('먼저 리그를 선택해주세요.')
    return <Navigate to={ROUTER_PATH.HOME} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
