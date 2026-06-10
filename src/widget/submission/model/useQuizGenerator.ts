import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  leagueInfoState,
  useFetchingPlayersIdInLeague,
} from '@/entities/league'
import { quizState } from './quizState'

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

const useQuizGenerator = (): {
  generateQuiz: () => void
  isGeneratingQuiz: boolean
  isChangingQuiz: boolean
  quizError: Error | null
  refetchQuiz: () => void
} => {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const [quiz, setQuiz] = useRecoilState(quizState)

  const [pickedPlayerId, setPickedPlayerId] = useState<number | null>(null)

  const leagueId = leagueInfo.id ?? 0

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
    playerId: pickedPlayerId ?? 0,
    enabled:
      pickedPlayerId != null &&
      pickedPlayerId > 0 &&
      !!leagueInfo.id &&
      !!playersId?.length,
  })

  // 다음 퀴즈 플레이어 ID 선택 및 선택된 플레이어 ID 저장
  useEffect(() => {
    if (!playersId?.length) {
      setPickedPlayerId(null)
      return
    }

    setPickedPlayerId(prev => {
      if (prev != null && playersId.includes(prev)) return prev
      const next = pickNextQuizPlayerId(playersId, null)
      return next ?? prev
    })
  }, [playersId])

  // 선택된 플레이어 데이터 설정
  useEffect(() => {
    if (!player) return
    setQuiz(player)
  }, [player, setQuiz])

  // 다음 퀴즈 생성
  const generateQuiz = useCallback(() => {
    if (!playersId?.length) return

    const next = pickNextQuizPlayerId(playersId, quiz?.id)
    if (next != null) setPickedPlayerId(next)
  }, [playersId, quiz?.id])

  return {
    generateQuiz,
    isGeneratingQuiz,
    isChangingQuiz,
    quizError,
    refetchQuiz,
  }
}

export default useQuizGenerator
