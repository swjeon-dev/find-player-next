import styles from './route-state.module.css'

function LoadingView() {
  return (
    <section
      className={styles['container']}
      aria-busy='true'
      aria-labelledby='route-loading-heading'
    >
      <div className={styles['content']}>
        <h1 id='route-loading-heading' className={styles['sr-only']}>
          불러오는 중
        </h1>
        <div className={styles['spinner']} aria-hidden='true' />
      </div>
    </section>
  )
}

export default LoadingView
