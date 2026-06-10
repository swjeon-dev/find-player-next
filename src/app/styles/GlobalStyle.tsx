import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    width: 100%;
    height: 100%;
    background-color: #001d3d;
    color: white;
  }
  a {
    text-decoration: none;
  }
`
