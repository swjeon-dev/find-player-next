import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import { sessionPersistStorage } from '@/shared/lib/storage/persistStorage'

const { persistAtom: persistLeagueAtom } = recoilPersist({
  key: 'leagueInfo',
  storage: sessionPersistStorage,
})

export type LeagueInfo = {
  id: number | null
}

export const leagueInfoState = atom<LeagueInfo>({
  key: 'leagueInfo',
  default: {
    id: null,
  },
  effects_UNSTABLE: [persistLeagueAtom],
})
