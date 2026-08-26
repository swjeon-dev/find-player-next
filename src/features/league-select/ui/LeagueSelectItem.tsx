'use client'
import Image from 'next/image'

import styles from './LeagueSelectModal.module.css'
import type { ILeagueInfo } from '@common/model'

interface LeagueSelectItemProps {
  league: ILeagueInfo
  onSelect: (leagueId: ILeagueInfo['id']) => void
  onPrefetch: (leagueId: number) => void
}

export default function LeagueSelectItem({
  league,
  onSelect,
  onPrefetch,
}: LeagueSelectItemProps) {
  return (
    <button
      type='button'
      className={styles['box']}
      onClick={() => onSelect(league.id)}
      onMouseEnter={() => onPrefetch(league.id)}
      aria-label={`${league.name} 리그 선택`}
    >
      <Image
        className={styles['emblem']}
        src={league.logo}
        width={70}
        height={70}
        alt={`${league.name} emblem image`}
      />
      <span className={styles['text']}>{league.name}</span>
    </button>
  )
}
