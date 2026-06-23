'use client'

import { memo } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import styles from './Club.module.css'

interface ClubProps {
  logo: string
  name: string
  isActive?: boolean
  emblemRef?: React.RefObject<HTMLImageElement | null>
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children?: React.ReactNode
}

const Club = ({
  logo,
  name,
  isActive = false,
  emblemRef,
  onMouseEnter,
  onMouseLeave,
  children,
}: ClubProps) => {
  return (
    <div
      className={clsx(styles['container'], isActive && styles['active'])}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Image
        className={styles['emblem']}
        src={logo}
        alt={name}
        width={60}
        height={60}
        ref={emblemRef}
      />
      {children}
    </div>
  )
}

export default memo(Club)
