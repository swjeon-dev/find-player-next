import { ProtectedRoute } from '@/app/routes'

export default function SubmissionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
