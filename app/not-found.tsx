import type { Metadata } from 'next'

import { NotFoundView } from '@/widget'

export const metadata: Metadata = {
  title: '404',
  description:
    '요청하신 페이지를 찾을 수 없습니다. 홈으로 이동해 다시 시작해보세요.',
  keywords: ['404', '페이지 없음'],
}

export default function NotFound() {
  return <NotFoundView />
}
