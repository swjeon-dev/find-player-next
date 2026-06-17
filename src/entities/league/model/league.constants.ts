import type { StaticImageData } from 'next/image'

import { plImage } from '../assets'

export interface LeagueListItem {
  name: string
  id: number
  emblem: StaticImageData
  label: string
}

export const LEAGUE_LIST: LeagueListItem[] = [
  {
    name: 'pl',
    id: 39,
    emblem: plImage,
    label: 'PL',
  },
]
