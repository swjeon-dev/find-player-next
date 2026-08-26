'use client'

import { type IHint } from '@/shared'
import type { IFirebasePlayer } from '@common/model'
import AutoSearchList from './AutoSearchList'
import useSearch from '../model/useSearch'
import styles from './SearchForm.module.css'

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
    <div className={styles['form']} role='search'>
      <div className={styles['input-wrap']}>
        <input
          className={styles['input']}
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
      </div>
    </div>
  )
}

export default SearchForm
