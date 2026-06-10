import 'styled-components'
import type { breakpoints } from './theme'

type BreakPointsType = typeof breakpoints

declare module 'styled-components' {
  export interface DefaultTheme {
    media: {
      [key in keyof BreakPointsType]: `@media screen and (max-width: ${BreakPointsType[key]})`
    }
  }
}
