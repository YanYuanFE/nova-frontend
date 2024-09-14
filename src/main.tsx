import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Router } from './Router.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="nova-theme">
      <Router />
    </ThemeProvider>
  </React.StrictMode>,
)
