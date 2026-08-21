import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAppPrecaching } from './utils/precache'

// Launch background pre-caching for Service Worker, safari media, and lazy routes
initAppPrecaching();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
