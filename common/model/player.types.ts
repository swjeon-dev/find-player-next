interface IPlayer {
  id: number
  name: string
  age: number
  number: number
  photo: string
  position: keyof typeof Position
}

interface IFirebasePlayer extends IPlayer {
  teamId: number
  teamLogo: string
  leagueId: number
}

enum Position {
  'Goalkeeper' = 'GK',
  'Defender' = 'DF',
  'Midfielder' = 'MD',
  'Attacker' = 'FW',
}

export { type IFirebasePlayer, type IPlayer, Position }
