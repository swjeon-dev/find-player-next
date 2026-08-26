import { SubmissionGameContainer } from '@/features/submission'
import { ClubViews } from '@/widget/club'

function SubmissionView({ leagueId }: { leagueId: number }) {
  return (
    <>
      <ClubViews leagueId={leagueId} />
      <SubmissionGameContainer leagueId={leagueId} />
    </>
  )
}

export default SubmissionView
