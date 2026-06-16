'use client'

import clsx from 'clsx'

import styles from './AutoSearchList.module.css'
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
    <ul className={styles['auto-search']} ref={listRef}>
      {searchingPlayers.map((player, idx) => (
        <button
          className={clsx(
            styles['player-box'],
            focusedIndex === idx && styles['selected'],
          )}
          key={`player-${player.id}`}
          type='button'
          onClick={() => handleSelect(player)}
        >
          <img
            className={styles['emblem']}
            src={player.teamLogo || ''}
            alt={player.teamId.toString()}
            width='25'
            height='25'
          />
          <span className={styles['player-name']}>{player.name}</span>
        </button>
      ))}
    </ul>
  )
}

export default AutoSearchList
