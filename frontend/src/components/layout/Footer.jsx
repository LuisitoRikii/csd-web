import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowUpRight, Instagram, Facebook, Music2, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { BUSINESS, SOCIAL, WHATSAPP_NUMBER } from '@/config'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="relative bg-cream border-t border-line/60">
      <div className="container-x py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <svg width="44" height="44" viewBox="0 0 64 64">
                <defs>
                  <linearGradient id="logoFG" x1="0" y1="0" x2="64" y2="64">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 44 L20 20 L24 18 L32 16 L40 18 L44 20 L48 44 L40 40 L32 42 L24 40 Z"
                  fill="url(#logoFG)"
                />
                <circle cx="32" cy="32" r="5" fill="#F5F3EE" />
              </svg>
              <span className="font-serif text-2xl tracking-tight">CSD</span>
            </Link>

            <p className="text-2xl lg:text-3xl font-serif leading-tight max-w-md mb-8">
              {t('footer.tagline')}
            </p>

            <div className="space-y-3 text-sm text-charcoal">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-steel" />
                <span>{BUSINESS.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-steel" />
                <a href={`tel:${BUSINESS.phone}`} className="hover:text-ink transition-colors">
                  {BUSINESS.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-steel" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-ink transition-colors">
                  {BUSINESS.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-steel" />
                <span>{BUSINESS.hours}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-eyebrow uppercase text-steel mb-5">{t('footer.explore')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/#about', label: t('nav.about') },
                { to: '/#services', label: t('nav.services') },
                { to: '/portfolio', label: t('nav.portfolio') },
                { to: '/#process', label: t('nav.process') },
                { to: '/blog', label: t('nav.blog') },
                { to: '/contact', label: t('nav.contact') },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-charcoal hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-eyebrow uppercase text-steel mb-5">{t('footer.services')}</h4>
            <ul className="space-y-2.5 text-sm text-charcoal">
              <li>Painting</li>
              <li>Murals</li>
              <li>Epoxy</li>
              <li>Remodeling</li>
              <li>Cleaning</li>
              <li>Maintenance</li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-eyebrow uppercase text-steel mb-5">Newsletter</h4>
            <p className="text-sm text-charcoal mb-4">
              Occasional project reveals, studio notes and design inspiration.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-full border border-line bg-paper text-sm focus:outline-none focus:border-ink/40"
                required
              />
              <button
                type="submit"
                className="w-full px-5 py-3 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-colors"
              >
                Subscribe
              </button>
            </form>

            <div className="flex items-center gap-3 mt-6">
              {SOCIAL.instagram && (
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-paper hover:border-ink transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              {SOCIAL.facebook && (
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-paper hover:border-ink transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {SOCIAL.tiktok && (
                <a
                  href={SOCIAL.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-paper hover:border-ink transition-all"
                  aria-label="TikTok"
                >
                  <Music2 size={16} />
                </a>
              )}
              {SOCIAL.youtube && (
                <a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-paper hover:border-ink transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20 pt-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-steel">{t('footer.legal')}</p>
          <p className="text-xs text-steel flex items-center gap-2">
            {t('footer.rights')}
            <span className="w-2 h-2 rounded-full bg-magenta animate-pulse" />
          </p>
        </div>
      </div>

      {/* Big bottom mark */}
      <div className="border-t border-line overflow-hidden">
        <div className="container-x py-12">
          <motion.div
            className="font-serif text-[14vw] leading-none tracking-tight text-ink/5 select-none whitespace-nowrap"
            initial={{ x: '0%' }}
            animate={{ x: '-50%' }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            CSD GOOD SERVICES · CSD GOOD SERVICES · CSD GOOD SERVICES ·
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
