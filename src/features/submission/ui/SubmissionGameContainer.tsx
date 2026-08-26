'use client'

import { useQuizGenerator } from '../model'
import SubmissionCard from './SubmissionCard'
import { SubmissionLoader } from './SubmissionLoader'
import styles from './SubmissionGameContainer.module.css'

function SubmissionGameContainer({ leagueId }: { leagueId: number }) {
  const {
    generateQuiz,
    isGeneratingQuiz,
    isChangingQuiz,
    quizError,
    refetchQuiz,
    player,
  } = useQuizGenerator({ leagueId })

  const retryFetching = () => {
    refetchQuiz()
  }

  if (quizError) {
    return (
      <SubmissionLoader
        message='선수 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'
        onRetry={retryFetching}
      />
    )
  }

  return (
    <div className={styles['container']} role='quiz-container'>
      <SubmissionCard
        player={player}
        isGeneratingQuiz={isGeneratingQuiz}
        isChangingQuiz={isChangingQuiz}
        generateQuiz={generateQuiz}
      />
    </div>
  )
}

export default SubmissionGameContainer
