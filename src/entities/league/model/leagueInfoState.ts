import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom: persistLeagueAtom } = recoilPersist({
  key: 'leagueInfo',
  storage: sessionStorage,
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
