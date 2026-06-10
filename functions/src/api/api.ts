import axios from 'axios'

const fetchErrorLogger = (error: unknown, context?: string) => {
  let message = '알 수 없는 오류가 발생했습니다.'
  const prefix = context ? `[${context}] ` : ''

  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message || error.message
    const status = error.response?.status || 'No Status'
    message = `API Error (${status}): ${apiMessage}`
  } else if (error instanceof Error) {
    message = error.message

    console.error(`${prefix}❌ Stack:`, error.stack)
  }

  console.error(`${prefix}❌ 최종 에러 메시지:`, message)
}

export { fetchErrorLogger }
