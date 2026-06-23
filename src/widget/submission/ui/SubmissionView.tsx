import { ClubViews } from '@/widget/club'
import SubmissionGameContainer from './SubmissionGameContainer'

function SubmissionView({ leagueId }: { leagueId: number }) {
  return (
    <>
      <ClubViews leagueId={leagueId} />
      <SubmissionGameContainer leagueId={leagueId} />
    </>
  )
}

export default SubmissionView
