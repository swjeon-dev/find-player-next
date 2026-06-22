import { LeagueSelectModal } from '@/entities/league'

import styles from './CoverView.module.css'
import type { ILeagueInfo } from '@common/model'

function CoverView({ leaguesInfo }: { leaguesInfo: ILeagueInfo[] }) {
  return (
    <section className={styles['container']} aria-label='게임 시작'>
      <LeagueSelectModal leaguesInfo={leaguesInfo} />
    </section>
  )
}

export default CoverView
