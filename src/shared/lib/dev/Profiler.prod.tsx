import type { ReactNode } from 'react'

interface ProfileCompProps {
  id: string
  children: ReactNode
}

export default function ProfileComp({ children }: ProfileCompProps) {
  return <>{children}</>
}
