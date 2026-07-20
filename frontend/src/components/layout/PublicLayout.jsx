import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <a href="#main" className="skip-link">Skip to main content</a>
      <ScrollProgress />
      <Header />
      <main id="main" className="flex-1 relative" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
