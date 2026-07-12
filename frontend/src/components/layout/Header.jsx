import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe2, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/utils/cn'
import { WHATSAPP_NUMBER } from '@/config'

export const Header = () => {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/portfolio', label: t('nav.portfolio') },
    { to: '/services', label: t('nav.services') },
    { to: '/about', label: t('nav.about') },
    { to: '/blog', label: t('nav.blog') },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-paper/90 backdrop-blur-md border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <svg width="36" height="36" viewBox="0 0 64 64" className="transition-colors" aria-hidden="true">
            <defs>
              <linearGradient id="logoHd" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
            </defs>
            <path
              d="M16 44 L20 20 L24 18 L32 16 L40 18 L44 20 L48 44 L40 40 L32 42 L24 40 Z"
              fill="url(#logoHd)"
            />
            <circle cx="32" cy="32" r="5" fill="#FAFAF7" />
          </svg>
          <span className={`font-serif text-xl tracking-tight transition-colors ${scrolled ? 'text-ink' : 'text-paper'}`}>
            CSD <span className="italic font-light">Good Services</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                  scrolled ? 'text-ink' : 'text-paper'
                } hover:opacity-70`}
              >
                {l.label}
                {active && (
                  <motion.svg
                    layoutId="navBrush"
                    className="absolute -bottom-1 left-2 right-2 h-1.5"
                    viewBox="0 0 60 6" preserveAspectRatio="none"
                  >
                    <path d="M0,3 C15,0 20,6 30,3 C40,0 45,6 60,3" stroke="#D946EF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </motion.svg>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleLang}
            className={`text-xs tracking-[0.15em] uppercase transition-colors ${scrolled ? 'text-ink' : 'text-paper'} hover:text-magenta`}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              scrolled ? 'bg-ink text-paper hover:bg-graphite' : 'bg-paper text-ink hover:bg-paper/90'
            }`}
          >
            {t('nav.quote')}
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden ${scrolled ? 'text-ink' : 'text-paper'}`}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-paper border-t border-line overflow-hidden"
          >
            <div className="container-x py-8 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-serif text-2xl tracking-tight text-ink border-b border-line/60"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-ink text-paper text-sm font-medium"
              >
                {t('nav.quote')} <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}