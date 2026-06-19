export const NOTIFICATION_REASON = {
  LEAGUE_LIST_UNAVAILABLE: 'league-list-unavailable',
} as const

export type NotificationReason =
  (typeof NOTIFICATION_REASON)[keyof typeof NOTIFICATION_REASON]

export const NOTIFICATION_MESSAGES: Record<NotificationReason, string> = {
  [NOTIFICATION_REASON.LEAGUE_LIST_UNAVAILABLE]:
    '리그 목록을 불러오지 못했습니다. Game Start를 다시 눌러 주세요.',
}
