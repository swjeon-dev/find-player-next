const FIREBASE_API_ENDPOINT = {
  LEAGUE_TEAM_IDS: (leagueId: number) => `/leagues/${leagueId}/teamIds`,
  LEAGUE_PLAYER_IDS: (leagueId: number) => `/leagues/${leagueId}/playerIds`,
  PLAYERS: (playerId: number) => `/players/${playerId}/info`,
  TOTAL_PLAYERS: () => `/players`,
  TEAM_DETAIL: (teamId: number) => `/teams/${teamId}/info`,
  TEAM_PLAYER_IDS: (teamId: number) => `/teams/${teamId}/playerIds`,
} as const

export default FIREBASE_API_ENDPOINT
