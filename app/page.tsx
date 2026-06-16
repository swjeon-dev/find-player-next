import type { Metadata } from 'next'

import { CoverView } from '@/widget'

export const metadata: Metadata = {
  title: '홈',
  description: '리그를 선택하고 선수 퀴즈를 시작하세요.',
  keywords: ['홈', '리그', '선수 퀴즈'],
}

export default function HomePage() {
  return <CoverView />
}
