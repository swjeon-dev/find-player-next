import type { DefaultTheme } from 'styled-components'

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
} as const

export const theme: DefaultTheme = {
  media: {
    mobile: `@media screen and (max-width: ${breakpoints.mobile})`,
    tablet: `@media screen and (max-width: ${breakpoints.tablet})`,
    desktop: `@media screen and (max-width: ${breakpoints.desktop})`,
  },
}
