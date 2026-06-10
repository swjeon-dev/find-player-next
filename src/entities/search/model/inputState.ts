import { atom } from 'recoil'

export const inputState = atom<string>({
  key: 'answer',
  default: '',
})
