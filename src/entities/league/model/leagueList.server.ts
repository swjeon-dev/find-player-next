import type { ILeagueInfo } from '@common/model'

import { fetchLeagueList } from '@/shared/api/server'

import { leagueDto } from './leagueDto'

export type LeagueListErrorCode = 'fetch_failed' | 'empty'

export class LeagueListError extends Error {
  readonly code: LeagueListErrorCode

  constructor(code: LeagueListErrorCode) {
    super(code)
    this.name = 'LeagueListError'
    this.code = code
  }
}

export function isLeagueListError(error: unknown): error is LeagueListError {
  return error instanceof LeagueListError
}

export async function fetchLeaguesInfoServer(): Promise<ILeagueInfo[]> {
  try {
    const leagues = await fetchLeagueList()
    const leaguesInfo = leagueDto(leagues)

    if (leaguesInfo.length === 0) {
      throw new LeagueListError('empty')
    }

    return leaguesInfo
  } catch (error) {
    if (isLeagueListError(error)) {
      throw error
    }

    throw new LeagueListError('fetch_failed')
  }
}
