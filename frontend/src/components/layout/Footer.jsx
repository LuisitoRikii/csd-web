import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  Music2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Briefcase,
} from 'lucide-react'
import { BUSINESS, SOCIAL, WHATSAPP_NUMBER } from '@/config'
import { serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import logo from '@/assets/logo.png'

export const Footer = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const phoneClean = BUSINESS.phone.replace(/[^+\d]/g, '')
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}`

  const { data: servicesData = [] } = useQuery({
    queryKey: ['services-active', lang],
    queryFn: () => serviceService.list({ active_only: true }),
  })

  // Take up to 12 services for the footer grid (2 columns × 6 rows)
  const services = (servicesData || []).slice(0, 12).map((s) => ({
    id: s.id,
    slug: s.slug,
    label: lang === 'es' ? s.title_es : s.title_en,
  }))

  const explore = [
    { to: '/',         label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/portfolio', label: t('nav.portfolio') },
    { to: '/about',     label: t('nav.about') },
    { to: '/blog',      label: t('nav.blog') },
    { to: '/contact',   label: t('nav.contact') },
  ]

  const cities = [
    'Miami', 'Doral', 'Hialeah', 'Miami Lakes', 'Pembroke Pines',
    'Aventura', 'Brickell', 'Pinecrest', 'Kendall', 'Homestead',
    'Coral Gables', 'Coconut Grove', 'Key Biscayne', 'Miami Beach',
    'Fort Lauderdale', 'Hollywood',
  ]

  return (
    <footer className="relative bg-ink text-paper/85">
      {/* Tri-color top stripe — the brand's signature */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1 bg-gradient-spectrum" />

      <div className="container-x py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Link to="/" aria-label="CSD Good Services home">
              <img
                src={logo}
                alt="CSD Good Services"
                className="h-28 w-auto rounded-md"
              />
            </Link>
            <p className="mt-7 text-xl lg:text-2xl font-serif leading-tight max-w-md text-paper">
              {t('footer.tagline')}
            </p>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-start gap-3 text-paper/70">
                <MapPin size={16} className="mt-0.5 text-paper/50 shrink-0" aria-hidden="true" />
                <span>{BUSINESS.address}</span>
              </div>
              <a
                href={`tel:${phoneClean}`}
                className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors"
              >
                <Phone size={16} className="text-paper/50 shrink-0" aria-hidden="true" />
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors break-all"
              >
                <Mail size={16} className="text-paper/50 shrink-0" aria-hidden="true" />
                {BUSINESS.email}
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-paper/50 shrink-0" aria-hidden="true">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
                WhatsApp
              </a>
              <div className="flex items-center gap-3 text-paper/70">
                <Clock size={16} className="text-paper/50 shrink-0" aria-hidden="true" />
                <span>{BUSINESS.hours}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {SOCIAL.instagram && (
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-paper/15 flex items-center justify-center hover:bg-mint hover:text-ink hover:border-mint transition-all"
                >
                  <Instagram size={16} aria-hidden="true" />
                </a>
              )}
              {SOCIAL.facebook && (
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full border border-paper/15 flex items-center justify-center hover:bg-violet hover:text-paper hover:border-violet transition-all"
                >
                  <Facebook size={16} aria-hidden="true" />
                </a>
              )}
              {SOCIAL.tiktok && (
                <a
                  href={SOCIAL.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full border border-paper/15 flex items-center justify-center hover:bg-magenta hover:text-paper hover:border-magenta transition-all"
                >
                  <Music2 size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/50 mb-5">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-paper/70 hover:text-paper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — from backend */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/50 mb-5">
              {t('footer.services')}
            </h4>
            {services.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-sm">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/services`}
                      state={{ openServiceSlug: s.slug }}
                      className="text-paper/70 hover:text-paper transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-paper/50 inline-flex items-center gap-2">
                <Briefcase size={14} aria-hidden="true" />
                {t('common.loading')}
              </div>
            )}
          </div>

          {/* Service Area */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/50 mb-5">
              {t('footer.service_area_label')}
            </h4>
            <ul className="space-y-2 text-sm text-paper/70">
              {cities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-paper/50">{t('footer.legal')}</p>
          <div className="flex items-center gap-4 text-xs text-paper/60">
            <Link to="/contact" className="hover:text-paper transition-colors">
              {t('nav.contact')}
            </Link>
            <span className="text-paper/20">·</span>
            <Link to="/quote" className="hover:text-paper transition-colors">
              {t('nav.quote')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
