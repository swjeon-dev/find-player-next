'use client'

import type { IHint } from '@/shared'
import { getHintColumns } from '../model/getHintColumns'
import { HintColumn } from './HintUI'
import styles from './HintList.module.css'

interface IHintListProps {
  hintArr: IHint[]
}

const HintList = ({ hintArr }: IHintListProps) => {
  if (!hintArr?.length) return null

  return (
    <ul className={styles['hint-list']}>
      {hintArr.map(({ q, a }) => (
        <li className={styles['hint-item']} key={a.id}>
          <h3 className={styles['answer']}>{a.name}</h3>
          <div className={styles['row']}>
            {getHintColumns(q, a).map(def => (
              <HintColumn key={def.label} def={def} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default HintList
