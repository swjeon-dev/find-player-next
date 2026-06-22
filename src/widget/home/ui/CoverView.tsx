import { LeagueSelectModal } from '@/entities/league'

import styles from './CoverView.module.css'
import type { ILeagueInfo } from '@common/model'

function CoverView({ leaguesInfo }: { leaguesInfo: ILeagueInfo[] }) {
  return (
    <section
      className={styles['container']}
      aria-labelledby='cover-game-heading'
    >
      <h2 className={styles['title']} id='cover-game-heading'>
        Game Start
      </h2>
      <LeagueSelectModal leaguesInfo={leaguesInfo} />
    </section>
  )
}

export default CoverView
