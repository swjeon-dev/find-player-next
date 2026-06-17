// TODO(refactor): quiz: IFirebasePlayer → playerId, 선수 데이터는 React Query로 분리
'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { IFirebasePlayer } from '@common/model'

interface QuizPlayer {
  quiz: IFirebasePlayer | undefined
  setQuiz: (quiz: IFirebasePlayer) => void
}

const useQuizStore = create<QuizPlayer>()(
  persist(
    set => ({
      quiz: undefined,
      setQuiz: quiz => set({ quiz }),
    }),
    {
      name: 'quiz-player',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useQuizStore }
