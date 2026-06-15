import * as S from './LeagueSelectModal.style'

export default function LeagueSelectModalTrigger({
  openModal,
}: {
  openModal: () => void
}) {
  return (
    <S.Button
      type='button'
      onClick={openModal}
      aria-labelledby='cover-game-heading'
    >
      <S.ButtonLabel>Game Start</S.ButtonLabel>
    </S.Button>
  )
}
