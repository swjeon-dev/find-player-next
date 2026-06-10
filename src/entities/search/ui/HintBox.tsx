import { type IFirebasePlayer, Position } from '@common/model'
import type { IHint } from '@/shared'

import * as S from './HintBox.style'

interface IHintBoxProps {
  hintArr: IHint[]
}

const HintBox = ({ hintArr }: IHintBoxProps) => {
  const hintColumns = (q: IFirebasePlayer, a: IFirebasePlayer) =>
    [
      {
        label: '클럽 이름',
        value: q.teamId === a.teamId,
        children: (
          <S.ClubEmblem
            src={a.teamLogo}
            alt={a.teamId.toString()}
            width='45'
            height='45'
          />
        ),
      },
      {
        label: '포지션',
        value: q.position === a.position,
        children: <span>{Position[a.position]}</span>,
      },
      {
        label: '등 번호',
        value: q.number === a.number,
        children: (
          <>
            <span>{a.number}</span>
            <span>
              {q.number > a.number ? '⬆' : q.number < a.number ? '⬇︎' : ''}
            </span>
          </>
        ),
      },
      {
        label: '나이',
        value: q.age === a.age,
        children: (
          <>
            <span>{a.age}</span>
            <span>{q.age > a.age ? '⬆' : q.age < a.age ? '⬇︎' : ''}</span>
          </>
        ),
      },
    ].map((col, idx) => (
      <HintColumnWrapper key={idx} label={col.label} isEqualValue={col.value}>
        {col.children}
      </HintColumnWrapper>
    ))

  if (!hintArr?.length) {
    return null
  }

  return (
    <S.HintList>
      {hintArr.map(({ q, a }) => (
        <S.HintItem key={a.id}>
          <S.MyAnswer>{a.name}</S.MyAnswer>
          <S.Row>{hintColumns(q, a)}</S.Row>
        </S.HintItem>
      ))}
    </S.HintList>
  )
}

export default HintBox

interface IHintColumnWrapper {
  isEqualValue: boolean
  children: React.ReactNode
  label: string
}

function HintColumnWrapper({
  isEqualValue,
  children,
  label,
}: IHintColumnWrapper) {
  return (
    <S.Hint $isEqual={isEqualValue}>
      {children}
      <S.Label>
        <span>{label}</span>
      </S.Label>
    </S.Hint>
  )
}
