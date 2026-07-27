import { StrictMode, useState, useEffect, useRef, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Unique id per pixel event — required for Conversions API deduplication (see api/subscribe.js).
function newEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const IngredientsPage = lazy(() => import('./IngredientsPage.jsx'))

function getInitialPath() {
  const params = new URLSearchParams(window.location.search)
  const redirectPath = params.get('p')
  if (redirectPath) {
    window.history.replaceState(null, '', redirectPath)
    return redirectPath
  }
  return window.location.pathname
}

function Router() {
  const [path, setPath] = useState(getInitialPath)
  // Tracks the last path we counted so we skip the initial load (already
  // tracked by the base snippet in index.html) and StrictMode's double-mount.
  const lastTrackedPath = useRef(path)

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Fire a PageView on every client-side route change (SPA), not on first load.
  useEffect(() => {
    if (path === lastTrackedPath.current) return
    lastTrackedPath.current = path
    window.fbq?.('track', 'PageView', {}, { eventID: newEventId() })
  }, [path])

  if (path === '/ingredients' || path === '/ingredients/') {
    return (
      <Suspense fallback={null}>
        <IngredientsPage />
      </Suspense>
    )
  }
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
