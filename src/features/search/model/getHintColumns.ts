import type { IFirebasePlayer } from '@common/model'

export type HintColumnDef = {
  label: string
  isEqual: boolean
  kind: 'club' | 'position' | 'number' | 'age'
  quiz: IFirebasePlayer
  answer: IFirebasePlayer
}

export function getHintColumns(
  q: IFirebasePlayer,
  a: IFirebasePlayer,
): HintColumnDef[] {
  return [
    {
      label: '클럽 이름',
      isEqual: q.teamId === a.teamId,
      kind: 'club',
      quiz: q,
      answer: a,
    },
    {
      label: '포지션',
      isEqual: q.position === a.position,
      kind: 'position',
      quiz: q,
      answer: a,
    },
    {
      label: '등 번호',
      isEqual: q.number === a.number,
      kind: 'number',
      quiz: q,
      answer: a,
    },
    {
      label: '나이',
      isEqual: q.age === a.age,
      kind: 'age',
      quiz: q,
      answer: a,
    },
  ]
}
