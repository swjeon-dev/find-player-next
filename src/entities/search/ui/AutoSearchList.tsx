'use client'

import * as S from './AutoSearch.style'
import type { IFirebasePlayer } from '@common/model'
import { useAutocompletePaint } from '../model/useAutocomplete'

interface IAutoSearchProps {
  searchingPlayers: IFirebasePlayer[]
  handleSelect: (player: IFirebasePlayer) => void
  focusedIndex: number
}

const AutoSearchList = ({
  searchingPlayers,
  handleSelect,
  focusedIndex,
}: IAutoSearchProps) => {
  const { hasResults, listRef } = useAutocompletePaint(
    focusedIndex,
    searchingPlayers,
  )

  if (!hasResults) return null

  return (
    <S.AutoSearchBox ref={listRef}>
      {searchingPlayers.map((player, idx) => (
        <S.PlayerBox
          key={`player-${player.id}`}
          type='button'
          $selected={focusedIndex === idx}
          onClick={() => handleSelect(player)}
        >
          <S.ClubEmblem
            src={player.teamLogo || ''}
            alt={player.teamId.toString()}
            width='25'
            height='25'
          />
          <S.Name>{player.name}</S.Name>
        </S.PlayerBox>
      ))}
    </S.AutoSearchBox>
  )
}

export default AutoSearchList
