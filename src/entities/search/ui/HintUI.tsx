'use client'

import { Position, type IFirebasePlayer } from '@common/model'
import * as S from './HintBox.style'
import type { IHint } from '@/shared'
import { getHintColumns, type HintColumnDef } from '../model/getHintColumns'

interface HintRowProps {
  children: React.ReactNode
  value: boolean
  label: string
}
interface ClubEmblemProps {
  src: string
  alt: string
  width: string
  height: string
}
interface BackNumberProps {
  aNumber: number
  qNumber: number
}
interface AgeProps {
  aAge: number
  qAge: number
}
interface PositionUIProps {
  position: keyof typeof Position
}

interface HintListProps {
  hintArr: IHint[]
}
function ClubEmblem({ src, alt, width, height }: ClubEmblemProps) {
  return <S.ClubEmblem src={src} alt={alt} width={width} height={height} />
}

function PositionUI({ position }: PositionUIProps) {
  return <span>{Position[position]}</span>
}
function BackNumber({ aNumber, qNumber }: BackNumberProps) {
  return (
    <>
      <span>{aNumber}</span>
      <span>{qNumber > aNumber ? '⬆' : qNumber < aNumber ? '⬇︎' : ''}</span>
    </>
  )
}
function Age({ aAge, qAge }: AgeProps) {
  return (
    <>
      <span>{aAge}</span>
      <span>{qAge > aAge ? '⬆' : qAge < aAge ? '⬇︎' : ''}</span>
    </>
  )
}

function HintRow({ children, value, label }: HintRowProps) {
  return (
    <S.Hint $isEqual={value}>
      {children}
      <S.Label>
        <span>{label}</span>
      </S.Label>
    </S.Hint>
  )
}

function HintCell({ kind, quiz, answer }: HintColumnDef) {
  switch (kind) {
    case 'club':
      return (
        <ClubEmblem
          src={answer.teamLogo}
          alt={answer.teamId.toString()}
          width='45'
          height='45'
        />
      )
    case 'position':
      return <PositionUI position={answer.position} />
    case 'number':
      return <BackNumber aNumber={answer.number} qNumber={quiz.number} />
    case 'age':
      return <Age aAge={answer.age} qAge={quiz.age} />
  }
}

function HintColumn({ def }: { def: HintColumnDef }) {
  return (
    <HintRow value={def.isEqual} label={def.label}>
      {HintCell(def)}
    </HintRow>
  )
}

function HintList({ hintArr }: HintListProps) {
  return (
    <S.HintList>
      {hintArr.map(({ q, a }) => (
        <S.HintItem key={a.id}>
          <S.MyAnswer>{a.name}</S.MyAnswer>
          <S.Row>
            {getHintColumns(q, a).map(def => (
              <HintColumn key={def.label} def={def} />
            ))}
          </S.Row>
        </S.HintItem>
      ))}
    </S.HintList>
  )
}

export { ClubEmblem, PositionUI, BackNumber, Age, HintRow, HintList }
