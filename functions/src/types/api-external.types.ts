import type { IPlayer } from '@common/model'

// request: teams in league
export interface IGetLeagueTable {
  get: string
  parameters: IGetLeagueTableParameters
  errors: any[]
  results: number
  paging: IPaging
  response: IResponse[]
}

export interface IGetLeagueTableParameters {
  league: string
  season: string
}

export interface IResponse {
  team: ITeam1
}

export interface ITeam1 {
  id: number
  name: string
  code: string
  country: string
  founded: number
  national: boolean
  logo: string
}

// request: squad
export interface IGetTeamSquads {
  get: string
  parameters: IGetTeamSquadsParameters
  errors: any[]
  results: number
  paging: IPaging
  response: IGetTeamSquadsResponse[]
}

export interface IGetTeamSquadsParameters {
  team: string
}

export interface IGetTeamSquadsResponse {
  team: ITeam2
  players: IPlayer[]
}

export interface ITeam2 {
  id: number
  name: string
  logo: string
}

export interface IPaging {
  current: number
  total: number
}
