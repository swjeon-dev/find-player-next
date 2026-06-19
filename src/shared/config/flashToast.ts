export const FLASH_TOAST_COOKIE_NAME = 'toast-message' as const

export const FLASH_TOAST_REASON = {
  NO_LEAGUE: 'no-league',
  INVALID_LEAGUE: 'invalid-league',
} as const

export type FlashToastReason =
  (typeof FLASH_TOAST_REASON)[keyof typeof FLASH_TOAST_REASON]

export const FLASH_TOAST_MESSAGES: Record<FlashToastReason, string> = {
  [FLASH_TOAST_REASON.NO_LEAGUE]: '먼저 리그를 선택해주세요.',
  [FLASH_TOAST_REASON.INVALID_LEAGUE]:
    '유효하지 않은 리그입니다. 리그를 다시 선택해주세요.',
}
