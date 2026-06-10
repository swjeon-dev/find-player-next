import { Profiler } from 'react'

export default function ProfileComp({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  function onRender(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) {
    console.log('컴포넌트:', id)
    console.log('단계:', phase)
    console.log('렌더링 시간:', actualDuration)
    console.log('baseDuration:', baseDuration)
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )
}
