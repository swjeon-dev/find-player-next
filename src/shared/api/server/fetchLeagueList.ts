import type { ILeague } from '@common/model'

import { FIREBASE_API_CONFIG } from '@/shared/config/firebaseEnv'
import { getFirebaseURLPath } from '@/shared/config/firebasePath'
import FIREBASE_API_ENDPOINT from '@/shared/config/firebaseRoute'

const LEAGUE_LIST_REVALIDATE_SECONDS = 60 * 60

export async function fetchLeagueListServer(): Promise<Record<string, ILeague>> {
  const path = getFirebaseURLPath(FIREBASE_API_ENDPOINT.LEAGUE_LIST)
  const url = `${FIREBASE_API_CONFIG.FIREBASE_API_BASE_URL}${path}`

  const response = await fetch(url, {
    headers: FIREBASE_API_CONFIG.FIREBASE_API_HEADERS,
    next: { revalidate: LEAGUE_LIST_REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch league list: ${response.status}`)
  }

  return response.json() as Promise<Record<string, ILeague>>
}
