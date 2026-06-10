export const queryKeysMain = {
  players: {
    all: ['players'] as const,
    // 팀의 선수 id 조회
    one: (playerId: number) => ['player', playerId] as const,

    // 리그의 선수 데이터 조회
    byLeague: (leagueId: number) =>
      [...queryKeysMain.players.all, 'league', leagueId] as const,

    // 팀의 선수 정보 조회
    byTeam: (teamId: number) =>
      [...queryKeysMain.players.all, 'team', teamId] as const,

    // 리그의 선수 id 조회
    idsByLeaguePersisted: (leagueId: number) =>
      ['persist', 'players', 'ids', 'league', leagueId] as const,
    filteringByName: (capitalizedValue: string) =>
      ['players', 'filtering', 'name', capitalizedValue] as const,
    // 팀의 선수 id 조회
    idsByTeam: (teamId: number) => ['players', 'ids', 'team', teamId] as const,
  },

  teams: {
    all: ['teams'] as const,

    // 리그 팀 id 조회,
    idsByLeaguePersisted: (leagueId: number) =>
      ['persist', 'teams', 'league', leagueId] as const,

    // 단일 팀 데이터 조회
    detail: (teamId: number) =>
      [...queryKeysMain.teams.all, 'detail', teamId] as const,
  },
} as const
