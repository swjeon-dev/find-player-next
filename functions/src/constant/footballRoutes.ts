// TODO: 리그 목록 동기화 추가
export const FOOTBAL_API_ENDPOINT = {
  // LEAGUE: `/leagues`,
  LEAGUE_TABLE: `/teams`, // ?league=${league}&season=${season}
  TEAM_SQUADS: `/players/squads`, // ?team=${teamId}
} as const
