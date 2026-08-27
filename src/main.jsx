import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { initAppPrecaching } from './utils/precache'

// Global Styles
import './index.css'

// Initialize pre-caching before the app renders to ensure 
// service workers/assets start loading in the background.
initAppPrecaching();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)