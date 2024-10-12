import React from 'react'
import ReactDOM from 'react-dom/client'
// Supports weights 100-900
import '@fontsource/geist-sans';
import './index.css'
import { Router } from './Router.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/toaster.tsx'
import { StarknetProvider } from './components/StarkProvider.tsx'
import { Toaster as HotToaster } from 'react-hot-toast';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="nova-theme">
      <QueryClientProvider client={queryClient}>
        <StarknetProvider>
          <Router />
        </StarknetProvider>
        <Toaster />
        <HotToaster />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
