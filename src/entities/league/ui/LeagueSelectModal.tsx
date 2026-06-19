'use client'

import useLeagueSelectModal from '../model/useLeagueSelectModal'
import LeagueSelectModalContent from './LeagueSelectModalContent'
import LeagueSelectModalTrigger from './LeagueSelectModalTrigger'
import type { ILeagueInfo } from '@common/model'

function LeagueSelectModal({ leaguesInfo }: { leaguesInfo: ILeagueInfo[] }) {
  const { isOpen, dialogRef, openModal, closeModal, selectLeague } =
    useLeagueSelectModal()

  return (
    <>
      <LeagueSelectModalTrigger onOpen={openModal} />
      <LeagueSelectModalContent
        leaguesInfo={leaguesInfo}
        isOpen={isOpen}
        dialogRef={dialogRef}
        onClose={closeModal}
        onSelectLeague={selectLeague}
      />
    </>
  )
}

export default LeagueSelectModal
