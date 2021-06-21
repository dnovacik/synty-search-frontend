import React from 'react'
import ReactDOM from 'react-dom'
import Styled from 'styled-components'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

// theme
import theme from './theme/theme'

// style
import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'

// router
import { MainRouter } from './router'

const AppRoot = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <App.Layout>
        <MainRouter />
      </App.Layout>
    </ThemeProvider>
  )
}

const App = {
  Layout: Styled.div`
    height: 100vh;
    display: flex;
    flex-direction: row;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.light['shade-1']};
  `
}

ReactDOM.render(
  <BrowserRouter>
    <AppRoot />
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
