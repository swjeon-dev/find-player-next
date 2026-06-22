export const LEAGUE_ID_COOKIE_NAME = 'league-id' as const

export const LEAGUE_ID_COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24,
  sameSite: 'lax',
} as const
