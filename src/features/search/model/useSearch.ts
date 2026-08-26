'use client'

import { useDebouncedValue, type IHint } from '@/shared'
import type { IFirebasePlayer } from '@common/model'

import { useAutocompleteListFocus } from './useAutocomplete'
import { useFilteringPlayersName } from './useFilteringPlayersName'
import { useInputStore } from './input.store'

interface IUseSearchProps {
  quiz: IFirebasePlayer
  setIsCorrect: React.Dispatch<boolean>
  setHintArr: React.Dispatch<React.SetStateAction<IHint[]>>
  disabled: boolean
}
export default function useSearch({
  quiz,
  setIsCorrect,
  setHintArr,
  disabled,
}: IUseSearchProps) {
  const value = useInputStore(state => state.value)
  const setValue = useInputStore(state => state.setValue)
  const debouncedValue = useDebouncedValue(value, 500)
  const { focusedIndex, setFocusedIndex } =
    useAutocompleteListFocus(debouncedValue)

  const { searchingPlayers, resetPlayers } = useFilteringPlayersName({
    debouncedValue,
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchingPlayers.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev =>
        prev < searchingPlayers.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (focusedIndex === 0) {
        setFocusedIndex(searchingPlayers.length - 1)
      } else {
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
      }
    } else if (e.key === 'Enter') {
      const targetPlayer =
        searchingPlayers[focusedIndex === -1 ? 0 : focusedIndex]
      if (targetPlayer) handleSelect(targetPlayer)
    } else if (e.key === 'Escape') {
      setFocusedIndex(-1)
    }
  }

  const handleSelect = (player: IFirebasePlayer) => {
    setFocusedIndex(-1)
    submitPlayer(player)
    resetPlayers()
  }

  const submitPlayer = (player: IFirebasePlayer) => {
    if (disabled) return
    const hintObj: IHint = { q: quiz, a: player }

    setHintArr(prev => {
      if (prev.find(h => h.a.id === player.id)) {
        alert('이미 입력한 이름입니다.')
        return prev
      }
      return [hintObj, ...prev]
    })

    if (quiz.id === player.id) {
      setIsCorrect(true)
      setFocusedIndex(-1)
    } else {
      setValue('')
    }
  }

  return {
    value,
    focusedIndex,
    searchingPlayers,
    onChange,
    onKeyDown,
    handleSelect,
  }
}
