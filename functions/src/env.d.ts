declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FUNCTION_FIREBASE_API_KEY: string
      FUNCTION_FOOTBALL_API_KEY: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}
