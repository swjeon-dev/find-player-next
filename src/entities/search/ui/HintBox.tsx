'use client'

import type { IHint } from '@/shared'

import { HintList } from './HintUI'

interface IHintBoxProps {
  hintArr: IHint[]
}

const HintBox = ({ hintArr }: IHintBoxProps) => {
  if (!hintArr?.length) return null
  return <HintList hintArr={hintArr} />
}

export default HintBox
