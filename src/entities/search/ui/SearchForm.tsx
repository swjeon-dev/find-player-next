'use client'

import { type IHint } from '@/shared'
import type { IFirebasePlayer } from '@common/model'
import AutoSearchList from './AutoSearchList'
import * as S from './SearchForm.style'
import useSearch from '../model/useSearch'

interface IForm {
  quiz: IFirebasePlayer
  disabled: boolean
  setIsCorrect: React.Dispatch<boolean>
  setHintArr: React.Dispatch<React.SetStateAction<IHint[]>>
}

function SearchForm({ quiz, disabled, setIsCorrect, setHintArr }: IForm) {
  const {
    value,
    focusedIndex,
    searchingPlayers,
    onChange,
    onKeyDown,
    handleSelect,
  } = useSearch({ quiz, setIsCorrect, setHintArr, disabled })

  return (
    <S.Form role='search'>
      <S.InputWrap>
        <S.Input
          name='search'
          disabled={disabled}
          onKeyDown={onKeyDown}
          value={value}
          onChange={onChange}
          placeholder='Write a Full-name'
          autoComplete='off'
          autoFocus={true}
        />

        <AutoSearchList
          searchingPlayers={searchingPlayers}
          handleSelect={handleSelect}
          focusedIndex={focusedIndex}
        />
      </S.InputWrap>
    </S.Form>
  )
}

export default SearchForm
