import axios from 'axios'

import { FIREBASE_API_CONFIG } from '../config/firebaseEnv'

export const firebaseApiInstance = axios.create({
  baseURL: FIREBASE_API_CONFIG.FIREBASE_API_BASE_URL,
  headers: FIREBASE_API_CONFIG.FIREBASE_API_HEADERS,
})
