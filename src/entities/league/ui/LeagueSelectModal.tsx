'use client'

import { createPortal } from 'react-dom'

import useLeagueSelectModal from '../model/useLeagueSelectModal'
import usePrefetchLeagueData from '../model/usePrefetchLeagueData'
import LeagueSelectModalContent from './LeagueSelectModalContent'
import LeagueSelectModalTrigger from './LeagueSelectModalTrigger'

function LeagueSelectModal() {
  const { isOpen, dialogRef, openModal, closeModal, setLeagueRange } =
    useLeagueSelectModal()
  const { prefetchingLeagueData } = usePrefetchLeagueData()

  return (
    <>
      <LeagueSelectModalTrigger openModal={openModal} />
      {isOpen &&
        createPortal(
          <LeagueSelectModalContent
            dialogRef={dialogRef}
            closeModal={closeModal}
            setLeagueRange={setLeagueRange}
            onPrefetch={prefetchingLeagueData}
          />,
          document.getElementById('modal-root') as HTMLElement,
        )}
    </>
  )
}

export default LeagueSelectModal
