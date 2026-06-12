'use client'

import { ROUTER_PATH } from '@/shared'

import * as S from './not-found.style'

function NotFoundContent() {
  return (
    <S.Page>
      <S.Card>
        <S.Content>
          <S.Title>페이지를 찾을 수 없습니다.</S.Title>
          <S.Description>
            잘못된 페이지 접근입니다. 홈으로 이동해주세요.
          </S.Description>
          <S.Actions>
            <S.ActionLink href={ROUTER_PATH.HOME}>홈으로 이동</S.ActionLink>
          </S.Actions>
        </S.Content>
      </S.Card>
    </S.Page>
  )
}

export default NotFoundContent
