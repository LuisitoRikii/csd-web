import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRoutes } from './routes'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

const App = () => (
  <>
    <ScrollToTop />
    <AppRoutes />
  </>
)

export default App
