import { initializeApp, getApps } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

// 이미 초기화되었는지 확인 (중복 초기화 방지)
if (!getApps().length) {
  initializeApp() // Cloud Functions 환경에서는 인자 없이 호출하면 자동 설정됨
}

export const adminDb = getDatabase()
