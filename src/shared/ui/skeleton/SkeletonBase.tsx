import clsx from 'clsx'

import styles from './SkeletonBase.module.css'

export default function SkeletonBase({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={clsx(styles['skeleton-base'], className)}>{children}</div>
  )
}
