export const FOOTBAL_API_ENDPOINT = {
  LEAGUE_TABLE: `/teams`, // ?league=${league}&season=${season}
  TEAM_SQUADS: `/players/squads`, // ?team=${teamId}
} as const
