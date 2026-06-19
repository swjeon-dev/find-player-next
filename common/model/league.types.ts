interface ILeagueInfo {
  id: number
  name: string
  logo: string
}

interface ILeague {
  info: ILeagueInfo
}

export type { ILeague, ILeagueInfo }
