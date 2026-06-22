import styles from './MainContainer.module.css'

export default function MainContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main id='main-content' className={styles['container']}>
      {children}
    </main>
  )
}
