import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'
import { ThemeProvider } from '@mui/material/styles'
import { Router } from 'react-router'
import { createHead, UnheadProvider } from '@unhead/react/client'

import { store, history } from './store'
import App from './App'
import { inDevelopment } from './environment'
import '@/supabase'
import './global.css'
import SupabaseClientContext from './contexts/SupabaseClient'
import { client as supabaseClient } from './supabase'
import { darkTheme } from './themes'

if (!inDevelopment() && process.env.REACT_APP_SENTRY_ID) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_ID,
  })
}

const head = createHead()

const domNode = document.getElementById('root')
const root = createRoot(domNode!)

root.render(
  <SupabaseClientContext.Provider value={supabaseClient}>
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={darkTheme}>
          <UnheadProvider head={head}>
            <App />
          </UnheadProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  </SupabaseClientContext.Provider>
)

if (process.env.NODE_ENV === 'development') {
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload()
  )
}
