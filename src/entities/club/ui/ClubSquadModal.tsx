import { memo, useRef } from 'react'

import {
  useFetchingTeamPlayersData,
  useModalPosition,
  useSelectPlayer,
} from '../model'
import * as S from './ClubSquadModal.style'

function Message({ message }: { message: string; isLoading?: boolean }) {
  return (
    <S.Loader>
      <span>{message}</span>
    </S.Loader>
  )
}

const Player = memo(function Player({
  name,
  handleClick,
}: {
  name: string
  handleClick: (name: string) => void
}) {
  return (
    <S.PlayerRow onClick={() => handleClick(name)}>
      <S.Name>{name}</S.Name>
    </S.PlayerRow>
  )
})

interface IClubSquadModalProps {
  teamId: number
  parentRef: React.RefObject<HTMLImageElement>
  offModal: () => void
}

const ClubSquadModal = ({
  teamId,
  parentRef,
  offModal,
}: IClubSquadModalProps) => {
  const {
    isPending,
    error,
    playerInTeam: players,
  } = useFetchingTeamPlayersData(teamId)
  const listRef = useRef<HTMLUListElement>(null)

  const { isReady, ...isTransfer } = useModalPosition({
    listRef,
    parentRef,
    triggerKey: teamId,
  })

  const handleClick = useSelectPlayer(offModal)

  return (
    <>
      <S.PlayerList ref={listRef} $isTransfer={isTransfer} $isVisible={isReady}>
        {isPending ? (
          <Message message='Loading...' />
        ) : error || !players?.length ? (
          <Message message='현재 선수 목록을 가져올 수 없습니다' />
        ) : (
          players.map(player => (
            <Player
              key={player.id}
              name={player.name}
              handleClick={handleClick}
            />
          ))
        )}
      </S.PlayerList>
    </>
  )
}

export default ClubSquadModal
