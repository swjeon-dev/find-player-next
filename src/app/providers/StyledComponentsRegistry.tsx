'use client'

import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [sheet] = useState(() => new ServerStyleSheet())

  // 렌더 중 콜백만 등록. 실행은 children 렌더로 sheet에 CSS 모인 뒤
  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement()
    sheet.instance.clearTag() // head에 넣은 뒤 sheet 비움 (중복 style 방지)
    return <>{styles}</>
  })

  // 클라이언트: head에 style 이미 있음 → hydration만, Manager 불필요
  if (typeof window !== 'undefined') return <>{children}</>

  // 서버: sheet에 CSS 수집
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}
