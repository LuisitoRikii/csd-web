import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CustomCursor } from '@/components/svg/CustomCursor'

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      <CustomCursor />
      <Header />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
