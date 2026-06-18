export const TOAST_COOKIE_NAME = 'toast-message' as const

export const TOAST_REASON = {
  NO_LEAGUE: 'no-league',
} as const

export type ToastReason = (typeof TOAST_REASON)[keyof typeof TOAST_REASON]

export const TOAST_MESSAGES: Record<ToastReason, string> = {
  [TOAST_REASON.NO_LEAGUE]: '먼저 리그를 선택해주세요.',
}
