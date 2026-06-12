import NotFoundContent from './NotFoundContent'

export const metadata = {
  title: '404',
  description:
    '요청하신 페이지를 찾을 수 없습니다. Find Football Player 홈으로 돌아가 다시 시작해보세요.',
}

export default function NotFound() {
  return <NotFoundContent />
}
