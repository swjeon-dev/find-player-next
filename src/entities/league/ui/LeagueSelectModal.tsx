'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { NOTIFICATION_REASON, showNotificationReason } from '@/shared'
import useLeagueSelectModal from '../model/useLeagueSelectModal'
import LeagueSelectModalContent from './LeagueSelectModalContent'
import LeagueSelectModalTrigger from './LeagueSelectModalTrigger'
import type { ILeagueInfo } from '@common/model'

function LeagueSelectModal({ leaguesInfo }: { leaguesInfo: ILeagueInfo[] }) {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()
  const { dialogRef, openModal, closeModal, selectLeague, isSelecting } =
    useLeagueSelectModal()

  const handleOpen = () => {
    if (leaguesInfo.length === 0) {
      showNotificationReason(NOTIFICATION_REASON.LEAGUE_LIST_UNAVAILABLE)
      startTransition(() => {
        router.refresh()
      })
      return
    }
    openModal()
  }

  return (
    <>
      <LeagueSelectModalTrigger
        onOpen={handleOpen}
        disabled={isRefreshing || isSelecting}
      />
      <LeagueSelectModalContent
        leaguesInfo={leaguesInfo}
        dialogRef={dialogRef}
        onClose={closeModal}
        onSelectLeague={selectLeague}
      />
    </>
  )
}

export default LeagueSelectModal
