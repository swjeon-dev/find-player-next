// football axios 인스턴스
import axios from 'axios'

const FOOTBALL_API_KEY = process.env.FUNCTION_FOOTBALL_API_KEY
const FOOTBALL_BASE_API_URL = 'https://v3.football.api-sports.io'

export const footballApiInstance = axios.create({
  baseURL: FOOTBALL_BASE_API_URL,
  headers: {
    'x-apisports-key': FOOTBALL_API_KEY,
    accept: 'application/json',
  },
})
