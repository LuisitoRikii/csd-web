import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe2, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/utils/cn'
import { WHATSAPP_NUMBER } from '@/config'
import logo from '@/assets/logo.png'

export const Header = () => {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const isHome = location.pathname === '/'
  // Solo en la home, con el Hero oscuro detrás, el texto arranca claro y se oscurece al scrollear.
  // En el resto de las páginas el texto es siempre oscuro.
  const lightText = isHome && !scrolled

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
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? 'mt-3 max-w-5xl rounded-full bg-paper/70 backdrop-blur-md border border-line/60 shadow-lift mx-4'
            : 'mt-0 max-w-none rounded-none bg-transparent border-transparent'
        }`}
      >
        <div
          className={`container-x flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-14 px-5 lg:px-6' : 'h-20'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="CSD Good Services"
              className={`object-contain transition-all duration-500 ${scrolled ? 'h-10 py-0' : 'h-28 pt-3'}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                    lightText ? 'text-paper' : 'text-ink'
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
              className={`text-xs tracking-[0.15em] uppercase transition-colors ${lightText ? 'text-paper' : 'text-ink'} hover:text-magenta`}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all ${
                scrolled ? 'px-4 py-2' : 'px-5 py-2.5'
              } ${
                lightText ? 'bg-paper text-ink hover:bg-paper/90' : 'bg-ink text-paper hover:bg-graphite'
              }`}
            >
              {t('nav.quote')}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={lightText ? 'text-paper lg:hidden' : 'text-ink lg:hidden'}
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
              className={`lg:hidden bg-paper border-t border-line overflow-hidden ${
                scrolled ? 'rounded-b-3xl' : ''
              }`}
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
      </div>
    </header>
  )
}