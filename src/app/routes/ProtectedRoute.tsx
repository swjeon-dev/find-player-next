'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ROUTER_PATH } from '@/shared'
import { useLeagueInfoHydrated, useLeagueInfoStore } from '@/entities/league'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const hydrated = useLeagueInfoHydrated()
  const leagueId = useLeagueInfoStore(state => state.id)

  const isLhci = process.env.NEXT_PUBLIC_LHCI === 'true'
  const canAccess = isLhci || Boolean(leagueId)

  useEffect(() => {
    if (!hydrated) return
    if (isLhci) return
    if (!leagueId) {
      alert('먼저 리그를 선택해주세요.')
      router.replace(ROUTER_PATH.HOME)
    }
  }, [hydrated, isLhci, leagueId, router])

  if (!hydrated) return null
  if (!canAccess) return null

  return <>{children}</>
}

export default ProtectedRoute
