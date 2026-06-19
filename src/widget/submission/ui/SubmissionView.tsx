import { ClubViews } from '@/widget/club'
import SubmissionGameContainer from './SubmissionGameContainer'

export const dynamic = 'force-dynamic'

function SubmissionView({ leagueId }: { leagueId: number }) {
  return (
    <>
      <ClubViews leagueId={leagueId} />
      <SubmissionGameContainer leagueId={leagueId} />
    </>
  )
}

export default SubmissionView
