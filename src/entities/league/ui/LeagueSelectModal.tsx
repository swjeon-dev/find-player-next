'use client'

import useLeagueSelectModal from '../model/useLeagueSelectModal'
import LeagueSelectModalContent from './LeagueSelectModalContent'
import LeagueSelectModalTrigger from './LeagueSelectModalTrigger'

function LeagueSelectModal() {
  const { isOpen, dialogRef, openModal, closeModal, selectLeague } =
    useLeagueSelectModal()

  return (
    <>
      <LeagueSelectModalTrigger onOpen={openModal} />
      <LeagueSelectModalContent
        isOpen={isOpen}
        dialogRef={dialogRef}
        onClose={closeModal}
        onSelectLeague={selectLeague}
      />
    </>
  )
}

export default LeagueSelectModal
