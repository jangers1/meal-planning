import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {CssVarsProvider} from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import App from './App.tsx'
import './main.css'
import {AlertProvider} from './components/ui_components/alerts/AlertProvider'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider>
      <CssBaseline />
      <AlertProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertProvider>
    </CssVarsProvider>
  </StrictMode>,
)