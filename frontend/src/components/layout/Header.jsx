import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { WHATSAPP_NUMBER } from '@/config'
import logo from '@/assets/logo.png'

export const Header = () => {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const isHome = location.pathname === '/'
  const lightText = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/',          label: t('nav.home') },
    { to: '/services',  label: t('nav.services') },
    { to: '/portfolio', label: t('nav.portfolio') },
    { to: '/about',     label: t('nav.about') },
    { to: '/blog',      label: t('nav.blog') },
  ]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? 'mt-3 max-w-5xl rounded-full bg-paper/85 backdrop-blur-md border border-line/70 shadow-soft mx-4'
            : 'mt-0 max-w-none rounded-none bg-transparent border-transparent'
        }`}
      >
        <div
          className={`container-x flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-14 px-5 lg:px-6' : 'h-20'
          }`}
        >
          <Link to="/" className="flex items-center group gap-2.5" aria-label="CSD Good Services home">
            <img
              src={logo}
              alt="CSD Good Services"
              className={`object-contain transition-all duration-500 ${scrolled ? 'h-10' : 'h-16 pt-3'}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                  lightText ? 'text-paper' : 'text-ink'
                } hover:opacity-80`}
              >
                {l.label}
                {isActive(l.to) && (
                  <motion.span
                    layoutId="navActive"
                    className="absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full bg-gradient-spectrum"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className={`text-xs tracking-[0.15em] uppercase font-medium transition-colors ${
                lightText ? 'text-paper/90 hover:text-mint' : 'text-charcoal hover:text-violet'
              }`}
              aria-label="Toggle language"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <Link
              to="/quote"
              className={`inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all ${
                scrolled ? 'px-4 py-2' : 'px-5 py-2.5'
              } ${
                lightText
                  ? 'bg-paper text-ink hover:bg-mint hover:shadow-glow-mint'
                  : 'text-paper bg-gradient-spectrum bg-[length:200%_100%] hover:bg-[position:100%_0] shadow-glow-vibe'
              }`}
              style={!lightText ? { backgroundPosition: '0% 50%', transition: 'background-position 600ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease' } : undefined}
            >
              {t('nav.quote')}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 ${lightText ? 'text-paper' : 'text-ink'}`}
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
                      className={`block py-3 font-serif text-2xl tracking-tight text-ink border-b border-line/60`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                <button
                  onClick={() => { toggleLang(); setOpen(false) }}
                  className="mt-6 inline-flex items-center justify-between px-4 py-3 rounded-xl border border-line text-sm font-medium text-ink"
                  aria-label="Toggle language"
                >
                  <span className="uppercase tracking-[0.18em] text-[11px] text-steel">Language</span>
                  <span className="font-serif text-lg">{lang === 'es' ? 'English' : 'Español'}</span>
                </button>
                <Link
                  to="/quote"
                  onClick={() => setOpen(false)}
                  className="mt-3 btn-primary justify-center"
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
