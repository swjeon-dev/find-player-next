'use client'

import { create } from 'zustand'

interface InputStore {
  value: string
  setValue: (value: string) => void
}

export const useInputStore = create<InputStore>(set => ({
  value: '',
  setValue: value => set({ value }),
}))
