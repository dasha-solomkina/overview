import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a00cb'
    },
    secondary: {
      main: '#c3c3c3' // divider and outline
    },
    text: {
      primary: '#1a1a1b'
    },
    background: {
      default: '#f1f2f5',
      paper: '#fff'
    }
  },
  typography: {
    fontFamily: `"Roboto", "Open Sans", sans-serif`,
    fontSize: 13
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0
        }
      }
    }
  }
})

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  )
} else {
  console.error('Root element not found')
}
