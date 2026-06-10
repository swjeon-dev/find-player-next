import { useRecoilValue } from 'recoil'

import { SearchForm, HintBox } from '@/entities/search'
import { quizState } from '../model'
import ChangeButton from './ChangeButton'
import { useSubmissionGame } from '../model'

import * as S from './SubmissionCard.style'

interface SubmissionCardProps {
  isGeneratingQuiz: boolean
  isChangingQuiz: boolean
  generateQuiz: () => void
}

const SubmissionCard = ({
  isGeneratingQuiz,
  isChangingQuiz,
  generateQuiz,
}: SubmissionCardProps) => {
  const quiz = useRecoilValue(quizState)
  const { hintArr, isCorrect, setIsCorrect, setHintArr, changeQuiz } =
    useSubmissionGame({ generateQuiz })

  const isDisabled = isGeneratingQuiz || isChangingQuiz || isCorrect
  /** 첫 로드 등 아직 사진이 없을 때만 스켈레톤. 선수 변경 시에는 이전 사진 유지 + 페치 애니메이션 */
  const showPhotoSkeleton = !quiz?.photo
  /** 새 query 펜딩이어도 quiz가 남아 있으면 스켈레톤 대신 페치 애니메이션 */
  const showFetchAnimation =
    isChangingQuiz || (isGeneratingQuiz && Boolean(quiz?.photo))

  return (
    <div role='submission-card'>
      <S.FormContainer
        $isPending={isGeneratingQuiz}
        $isChanging={showFetchAnimation}
        role='submission-card'
      >
        {showPhotoSkeleton ? (
          <S.PhotoSkeleton />
        ) : (
          <S.Photo
            key={quiz?.photo}
            draggable={false}
            src={quiz?.photo}
            alt={quiz?.name ?? 'quiz-player'}
            $isCorrect={isCorrect}
            $isChanging={showFetchAnimation}
            width='160'
            height='180'
          />
        )}

        <SearchForm
          quiz={quiz}
          disabled={isDisabled}
          setIsCorrect={setIsCorrect}
          setHintArr={setHintArr}
        />
      </S.FormContainer>

      <HintBox hintArr={hintArr} />
      <ChangeButton onClick={changeQuiz} />
    </div>
  )
}

export default SubmissionCard
