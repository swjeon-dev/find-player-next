'use client'

import { useState } from 'react'

import { useInputStore } from '@/entities/search'
import type { IHint } from '@/shared'

interface IUseSubmissionGameProps {
  generateQuiz: () => void
}

const useSubmissionGame = ({ generateQuiz }: IUseSubmissionGameProps) => {
  const [hintArr, setHintArr] = useState<IHint[]>([])
  const [isCorrect, setIsCorrect] = useState(false)

  const setInputValue = useInputStore(state => state.setValue)

  const resetQuiz = () => {
    setIsCorrect(false)
    setHintArr([])
    setInputValue('')
  }

  const changeQuiz = () => {
    generateQuiz()
    resetQuiz()
  }

  return {
    hintArr,
    isCorrect,
    setIsCorrect,
    setHintArr,
    changeQuiz,
  }
}

export default useSubmissionGame
