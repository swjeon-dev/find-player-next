'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface QuizPlayerId {
  selectedPlayerId: number | null
  setSelectedPlayerId: (selectedPlayerId: number | null) => void
}

const useQuizStore = create<QuizPlayerId>()(
  persist(
    set => ({
      selectedPlayerId: null,
      setSelectedPlayerId: selectedPlayerId => set({ selectedPlayerId }),
    }),
    {
      name: 'quiz-player-id',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useQuizStore }
