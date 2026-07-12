import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, ImageIcon, Calendar, MessageSquare, FileText,
  Settings, LogOut, Menu, X, Users, ChevronRight, Search,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/services', icon: Briefcase, label: 'Services' },
  { to: '/admin/projects', icon: ImageIcon, label: 'Projects' },
  { to: '/admin/categories', icon: Calendar, label: 'Categories' },
  { to: '/admin/quotes', icon: FileText, label: 'Quotes' },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/blog', icon: MessageSquare, label: 'Blog' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/users', icon: Users, label: 'Team' },
]

export const AdminShell = ({ children, title, subtitle, actions }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (to) => {
    if (to === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(to)
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-line bg-cream">
        <Link to="/" className="flex items-center gap-2 p-6 border-b border-line">
          <svg width="36" height="36" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="logoAdm" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
            </defs>
            <path d="M16 44 L20 20 L24 18 L32 16 L40 18 L44 20 L48 44 L40 40 L32 42 L24 40 Z" fill="url(#logoAdm)" />
            <circle cx="32" cy="32" r="5" fill="#F5F3EE" />
          </svg>
          <div>
            <span className="font-serif text-lg leading-none block">CSD Admin</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-steel">Studio Panel</span>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-ink text-paper'
                    : 'text-charcoal hover:bg-paper'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-line">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-paper mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan via-violet to-magenta text-paper flex items-center justify-center text-sm font-medium">
              {user?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-steel truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-charcoal hover:bg-paper transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs text-steel hover:text-ink transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-cream border-b border-line">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 64 64">
              <defs>
                <linearGradient id="logoAdmM" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
              </defs>
              <path d="M16 44 L20 20 L24 18 L32 16 L40 18 L44 20 L48 44 L40 40 L32 42 L24 40 Z" fill="url(#logoAdmM)" />
              <circle cx="32" cy="32" r="5" fill="#F5F3EE" />
            </svg>
            <span className="font-serif">Admin</span>
          </Link>
          <button onClick={() => setOpen(true)} className="p-2"><Menu size={20} /></button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-canvas overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-line">
            <span className="font-serif text-xl">CSD Admin</span>
            <button onClick={() => setOpen(false)}><X size={20} /></button>
          </div>
          <nav className="p-4 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-red-600"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 min-w-0 lg:overflow-auto pt-20 lg:pt-0">
        {(title || actions) && (
          <header className="sticky top-0 bg-canvas/95 backdrop-blur z-30 border-b border-line">
            <div className="px-6 lg:px-12 py-5 flex items-start lg:items-center justify-between gap-4 flex-col lg:flex-row">
              {title && (
                <div>
                  {subtitle && <p className="text-xs tracking-[0.2em] uppercase text-steel mb-1">{subtitle}</p>}
                  <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">{title}</h1>
                </div>
              )}
              {actions && <div className="flex gap-2">{actions}</div>}
            </div>
          </header>
        )}
        <div>{children}</div>
      </main>
    </div>
  )
}
