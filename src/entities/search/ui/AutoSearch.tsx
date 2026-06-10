import { useEffect, useRef } from 'react'
import * as S from './AutoSearch.style'
import type { IFirebasePlayer } from '@common/model'

interface IAutoSearchProps {
  searchingPlayers: IFirebasePlayer[]
  handleSelect: (player: IFirebasePlayer) => void
  focusedIndex: number
}

const AutoSearch = ({
  searchingPlayers,
  handleSelect,
  focusedIndex,
}: IAutoSearchProps) => {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return
    const el = listRef.current.children[focusedIndex] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [focusedIndex])

  const hasResults = searchingPlayers.length > 0
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

export default AutoSearch
