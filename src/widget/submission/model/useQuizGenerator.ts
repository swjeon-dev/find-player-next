'use client'

import { useCallback, useEffect } from 'react'

import { useFetchingPlayersIdInLeague } from '@/entities/league'
import type { IFirebasePlayer } from '@common/model'

import { useQuizStore } from './quiz.store'
import useFetchingPlayerData from './useFetchingPlayerData'

const MAX_RANDOM_TRIES = 100

function pickNextQuizPlayerId(
  ids: number[],
  previousId: number | null | undefined,
): number | null {
  if (!ids?.length) return null
  if (ids.length === 1) return ids[0]!

  const exclude =
    typeof previousId === 'number' && ids.includes(previousId)
      ? previousId
      : undefined

  if (exclude == null) return ids[Math.floor(Math.random() * ids.length)]!
  let next = ids[Math.floor(Math.random() * ids.length)]!
  let tries = 0
  while (next === exclude && tries++ < MAX_RANDOM_TRIES) {
    next = ids[Math.floor(Math.random() * ids.length)]!
  }
  return next
}

const useQuizGenerator = ({
  leagueId,
}: {
  leagueId: number
}): {
  generateQuiz: () => void
  isGeneratingQuiz: boolean
  isChangingQuiz: boolean
  quizError: Error | null
  refetchQuiz: () => void
  player: IFirebasePlayer | undefined
} => {
  const quizPlayerId = useQuizStore(state => state.selectedPlayerId)
  const setQuizPlayerId = useQuizStore(state => state.setSelectedPlayerId)

  const { playersId } = useFetchingPlayersIdInLeague({
    leagueId,
  })

  const {
    isPending: isGeneratingQuiz,
    isFetching: isChangingQuiz,
    error: quizError,
    refetch: refetchQuiz,
    player,
  } = useFetchingPlayerData({
    playerId: quizPlayerId,
    enabled: quizPlayerId != null && !!leagueId && !!playersId?.length,
  })

  useEffect(() => {
    if (!playersId?.length) {
      setQuizPlayerId(null)
      return
    }

    if (quizPlayerId != null && playersId.includes(quizPlayerId)) return

    const nextPlayerId = pickNextQuizPlayerId(playersId, null)
    if (nextPlayerId != null) setQuizPlayerId(nextPlayerId)
  }, [playersId, quizPlayerId, setQuizPlayerId])

  const generateQuiz = useCallback(() => {
    if (!playersId?.length) return

    const next = pickNextQuizPlayerId(playersId, quizPlayerId)
    if (next != null) setQuizPlayerId(next)
  }, [playersId, quizPlayerId, setQuizPlayerId])

  return {
    generateQuiz,
    isGeneratingQuiz,
    isChangingQuiz,
    quizError,
    refetchQuiz,
    player,
  }
}

export default useQuizGenerator
