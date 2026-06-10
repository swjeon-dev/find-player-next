import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import type { IFirebasePlayer } from '@common/model'

const { persistAtom: persistQuizAtom } = recoilPersist({
  key: 'quizPlayer',
  storage: sessionStorage,
})

type Quiz = IFirebasePlayer

/** 변경 버튼·페이지 이탈 전까지 탭 세션 동안 현재 퀴즈 유지 (새로고침 포함) */
export const quizState = atom<Quiz | null>({
  key: 'quizPlayer',
  default: null,
  effects_UNSTABLE: [persistQuizAtom],
})
