'use client'

import * as S from './ClubViews.style'

function ClubViewsError({ onRetry }: { onRetry: () => void }) {
  return (
    <S.ErrorBox role='alert'>
      <span>팀 데이터를 불러오지 못했습니다</span>
      <S.RetryButton onClick={onRetry}>다시 시도</S.RetryButton>
    </S.ErrorBox>
  )
}

export default ClubViewsError
