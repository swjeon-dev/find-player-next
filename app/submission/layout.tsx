import ProtectedRoute from '@/app/routes/ProtectedRoute'

export default function SubmissionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
