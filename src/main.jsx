import { StrictMode, useState, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

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
