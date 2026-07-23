import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { BUSINESS } from '@/config'
import logo from '@/assets/logo.png'

export const Header = () => {
  const { t } = useTranslation()
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => { setOpen(false) }, [location.pathname])

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
    <header className="fixed top-0 inset-x-0 z-50">
      {/*
        Barra superior — hoy en `bg-accent` (= ink, negro), texto `text-accent-ink` (blanco).
        Para la versión llamativa tipo CertaPro: en tailwind.config.js cambiá
        accent.DEFAULT a '#8A04F0' (violet) y accent.ink a '#FFFFFF', o directamente
        reemplazá acá `bg-accent text-accent-ink` por `bg-violet text-white`.
      */}
      <div className="bg-accent text-accent-ink">
        <div className="container-x flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center shrink-0" aria-label="CSD Good Services home">
            <img src={logo} alt="CSD Good Services" className="h-11 object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="text-sm font-semibold tracking-wide opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Toggle language"
            >
              {lang === 'es' ? 'ES' : 'US'}
            </button>
            <span className="w-px h-5 bg-current opacity-25" />
            <div className="flex items-center gap-2.5">
              <Phone size={17} strokeWidth={2.4} />
              <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                {(BUSINESS.phones || [BUSINESS.phone]).map((ph, i, arr) => (
                  <span key={ph} className="flex items-center gap-2">
                    <a
                      href={`tel:${ph.replace(/[^+\d]/g, '')}`}
                      className="hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {ph}
                    </a>
                    {i < arr.length - 1 && <span className="opacity-50">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/quote"
            className="inline-flex items-center rounded-full bg-ruby hover:bg-ruby-dark text-paper text-sm font-bold uppercase tracking-wide px-7 py-3.5 shadow-glow-vibe active:scale-[0.98] transition"
          >
            {t('nav.quote')}
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ---------- Nav inferior blanco, links centrados ---------- */}
      <div
        className={`hidden md:block bg-canvas border-b border-line transition-shadow duration-300 ${
          scrolled ? 'shadow-soft' : ''
        }`}
      >
        <div className="container-x flex items-center justify-center h-14">
          <nav className="flex items-center gap-8">
            {links.map((l) => {
              const active = isActive(l.to)
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative py-2 text-[15px] font-medium transition-colors ${
                    active ? 'text-ink' : 'text-steel hover:text-ink'
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-ink" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* ---------- Menu mobile (drawer lateral) ---------- */}
      <div
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ease-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm cursor-default"
        />

        <aside
          role="dialog"
          aria-label="Mobile menu"
          className={`absolute right-0 top-0 bottom-0 w-[86%] max-w-sm bg-canvas border-l border-line flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-[72px] px-5 flex items-center justify-between border-b border-line shrink-0">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-steel">
              {lang === 'es' ? 'Menú' : 'Menu'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="flex flex-col">
              {links.map((l) => {
                const active = isActive(l.to)
                return (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-4 font-serif text-2xl tracking-tight border-b border-line/60 transition-colors ${
                        active ? 'text-ink' : 'text-steel hover:text-ink'
                      }`}
                    >
                      <span>{l.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-ink" />}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 font-serif text-2xl tracking-tight border-b border-line/60 text-steel hover:text-ink transition-colors"
                >
                  <span>{t('nav.contact')}</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="px-5 py-5 border-t border-line flex flex-col gap-3">
            {(BUSINESS.phones || [BUSINESS.phone]).map((ph) => (
              <a
                key={ph}
                href={`tel:${ph.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-line text-sm font-medium text-ink hover:border-ink/30 transition-colors"
              >
                <Phone size={15} />
                {ph}
              </a>
            ))}

            <button
              onClick={() => { toggleLang(); setOpen(false) }}
              className="inline-flex items-center justify-between px-4 py-3 rounded-lg border border-line text-sm font-medium text-ink hover:border-ink/30 transition-colors"
              aria-label="Toggle language"
            >
              <span className="uppercase tracking-[0.18em] text-[11px] text-steel">Language</span>
              <span className="font-serif text-lg">{lang === 'es' ? 'English' : 'Español'}</span>
            </button>

            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-ruby text-paper text-sm font-bold uppercase tracking-wide px-6 py-3"
            >
              {t('nav.quote')}
            </Link>
          </div>
        </aside>
      </div>
    </header>
  )
}