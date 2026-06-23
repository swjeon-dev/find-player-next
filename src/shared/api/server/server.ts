import type { ILeague } from '@common/model'

import defaultServerFetch from './defaultFetch'
import { getRtdbURLPath } from '../../config/rtdbPath'
import RTDB_API_ENDPOINT from '../../config/rtdbRoute'
export const LEAGUE_LIST_CACHE_TAG = 'league-list'

const LEAGUE_LIST_REVALIDATE_SECONDS = 60 * 60

async function fetchLeagueList(): Promise<Record<string, ILeague>> {
  const path = getRtdbURLPath(RTDB_API_ENDPOINT.LEAGUE_LIST)

  return defaultServerFetch<Record<string, ILeague>>(
    path,
    {
      revalidate: LEAGUE_LIST_REVALIDATE_SECONDS,
      tags: [LEAGUE_LIST_CACHE_TAG],
    },
    'fetch league list',
  )
}

export default fetchLeagueList
