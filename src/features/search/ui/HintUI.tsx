'use client'
import Image from 'next/image'
import clsx from 'clsx'

import { Position } from '@common/model'
import { type HintColumnDef } from '../model/getHintColumns'
import styles from './HintUI.module.css'

interface HintRowProps {
  children: React.ReactNode
  isEqual: boolean
  label: string
}
interface ClubEmblemProps {
  src: string
  alt: string
  width: number
  height: number
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

function ClubEmblem({ src, alt, width, height }: ClubEmblemProps) {
  return (
    <Image
      className={styles['emblem']}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  )
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

function HintRow({ children, isEqual, label }: HintRowProps) {
  return (
    <div
      className={clsx(
        styles['hint'],
        isEqual ? styles['equal'] : styles['not-equal'],
      )}
    >
      {children}
      <label className={styles['label']}>
        <span>{label}</span>
      </label>
    </div>
  )
}

function HintCell({ kind, quiz, answer }: HintColumnDef) {
  switch (kind) {
    case 'club':
      return (
        <ClubEmblem
          src={answer.teamLogo}
          alt={answer.teamId.toString()}
          width={45}
          height={45}
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
    <HintRow isEqual={def.isEqual} label={def.label}>
      {HintCell(def)}
    </HintRow>
  )
}

export { HintColumn }
