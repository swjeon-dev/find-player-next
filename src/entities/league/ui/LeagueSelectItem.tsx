import styles from './LeagueSelectModal.module.css'
import type { LeagueListItem } from '../model/league.constants'

interface LeagueSelectItemProps {
  league: LeagueListItem
  onSelect: (league: LeagueListItem) => void
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
      onClick={() => onSelect(league)}
      onMouseEnter={() => onPrefetch(league.id)}
      aria-label={`${league.label} 리그 선택`}
    >
      <img
        className={styles['emblem']}
        src={league.emblem.src}
        width='70'
        height='70'
        alt={`${league.name} emblem image`}
      />
      <span className={styles['text']}>{league.label}</span>
    </button>
  )
}
