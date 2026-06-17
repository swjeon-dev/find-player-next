'use client'

import clsx from 'clsx'

import { HintList, SearchForm } from '@/entities/search'
import { SkeletonBase } from '@/shared'
import type { IFirebasePlayer } from '@common/model'

import ChangeButton from './ChangeButton'
import { useSubmissionGame } from '../model'
import styles from './SubmissionCard.module.css'

interface SubmissionCardProps {
  player: IFirebasePlayer | undefined
  isGeneratingQuiz: boolean
  isChangingQuiz: boolean
  generateQuiz: () => void
}

const SubmissionCard = ({
  player,
  isGeneratingQuiz,
  isChangingQuiz,
  generateQuiz,
}: SubmissionCardProps) => {
  const { hintArr, isCorrect, setIsCorrect, setHintArr, changeQuiz } =
    useSubmissionGame({ generateQuiz })

  const isDisabled = isGeneratingQuiz || isChangingQuiz || isCorrect
  /** 첫 로드 등 아직 사진이 없을 때만 스켈레톤. 선수 변경 시에는 이전 사진 유지 + 페치 애니메이션 */
  const showPhotoSkeleton = !player?.photo
  /** 새 query 펜딩이어도 player가 남아 있으면 스켈레톤 대신 페치 애니메이션 */
  const showFetchAnimation =
    isChangingQuiz || (isGeneratingQuiz && Boolean(player?.photo))

  return (
    <div role='submission-card'>
      <div
        className={clsx(
          styles['form-container'],
          isGeneratingQuiz
            ? styles['opacity-pending']
            : showFetchAnimation && styles['opacity-changing'],
        )}
      >
        {showPhotoSkeleton ? (
          <SkeletonBase className={styles['photo-skeleton']} />
        ) : (
          <img
            className={clsx(
              styles['photo'],
              !isCorrect && styles['not-correct--blur'],
              showFetchAnimation && styles['changing-animation'],
            )}
            key={player?.photo}
            draggable={false}
            src={player?.photo}
            alt={player?.name ?? 'quiz-player'}
            width='160'
            height='180'
          />
        )}

        {player && (
          <SearchForm
            quiz={player}
            disabled={isDisabled}
            setIsCorrect={setIsCorrect}
            setHintArr={setHintArr}
          />
        )}
      </div>

      <HintList hintArr={hintArr} />
      <ChangeButton onClick={changeQuiz} />
    </div>
  )
}

export default SubmissionCard
