import { RTDB_CONFIG } from '../config/rtdbConfig'

import type { RtdbRequestInit } from './fetch.type'

export async function rtdbRequest<T>(
  path: string,
  init: RtdbRequestInit,
  errorMessage?: string,
): Promise<T> {
  const url = `${RTDB_CONFIG.RTDB_BASE_URL}${path}`

  const response = await fetch(url, {
    ...init,
    headers: {
      ...RTDB_CONFIG.RTDB_HEADERS,
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to ${errorMessage || 'fetch data'}: ${response.status}`,
    )
  }

  return response.json()
}
