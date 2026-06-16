import { LeagueSelectModal } from '@/entities/league'

import styles from './CoverView.module.css'

function CoverView() {
  return (
    <section
      className={styles['container']}
      aria-labelledby='cover-game-heading'
    >
      <h2 className={styles['title']} id='cover-game-heading'>
        Game Start
      </h2>
      <LeagueSelectModal />
    </section>
  )
}

export default CoverView
