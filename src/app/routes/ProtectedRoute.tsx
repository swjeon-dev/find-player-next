'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { ROUTER_PATH } from '@/shared'
import { leagueInfoState } from '@/entities/league'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const leagueInfo = useRecoilValue(leagueInfoState)

  const canAccess =
    process.env.NEXT_PUBLIC_LHCI === 'true' || Boolean(leagueInfo.id)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_LHCI === 'true') return
    if (!leagueInfo.id) {
      alert('먼저 리그를 선택해주세요.')
      router.replace(ROUTER_PATH.HOME)
    }
  }, [leagueInfo.id, router])

  if (!canAccess) return null

  return <>{children}</>
}

export default ProtectedRoute
