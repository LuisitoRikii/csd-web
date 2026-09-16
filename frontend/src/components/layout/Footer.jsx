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
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}`

  const { data: servicesData = [] } = useQuery({
    queryKey: ['services-active', lang],
    queryFn: () => serviceService.list({ active_only: true }),
  })

  const services = (servicesData || []).slice(0, 12).map((s) => ({
    id: s.id,
    slug: s.slug,
    label: lang === 'es' ? s.title_es : s.title_en,
  }))

  const explore = [
    { to: '/',          label: t('nav.home') },
    { to: '/services',  label: t('nav.services') },
    { to: '/portfolio', label: t('nav.portfolio') },
    { to: '/about',     label: t('nav.about') },
    { to: '/blog',      label: t('nav.blog') },
    { to: '/contact',   label: t('nav.contact') },
  ]

  const cities = [
    'Miami-Dade County (Primary Service Area)',
    'Broward County',
    'Palm Beach County',
    'Serving all of Florida',
  ]

  return (
    <footer className="relative bg-ink text-paper/85 border-t border-line">
      <div className="container-x py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <Link to="/" aria-label="CSD Good Services home">
              <img
                src={logo}
                alt="CSD Good Services"
                className="h-24 w-auto rounded-md"
              />
            </Link>
            <p className="mt-6 text-lg lg:text-xl font-serif leading-snug max-w-md text-paper">
              {t('footer.tagline')}
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <div className="flex items-start gap-3 text-paper/70">
                <MapPin size={14} className="mt-0.5 text-paper/50 shrink-0" aria-hidden="true" />
                <span>{BUSINESS.address}</span>
              </div>
              {(BUSINESS.phones || [BUSINESS.phone]).map((ph) => (
                <a
                  key={ph}
                  href={`tel:${ph.replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors"
                >
                  <Phone size={14} className="text-paper/50 shrink-0" aria-hidden="true" />
                  {ph}
                </a>
              ))}
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors break-all">
                <Mail size={14} className="text-paper/50 shrink-0" aria-hidden="true" />
                {BUSINESS.email}
              </a>
              <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-paper/50 shrink-0" aria-hidden="true">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                </svg>
                WhatsApp
              </a>
              <div className="flex items-center gap-3 text-paper/70">
                <Clock size={14} className="text-paper/50 shrink-0" aria-hidden="true" />
                <span>{BUSINESS.hours}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {SOCIAL.instagram && (
                <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-lg border border-paper/15 flex items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-colors">
                  <Instagram size={14} aria-hidden="true" />
                </a>
              )}
              {SOCIAL.facebook && (
                <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-lg border border-paper/15 flex items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-colors">
                  <Facebook size={14} aria-hidden="true" />
                </a>
              )}
              {SOCIAL.tiktok && (
                <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"
                  className="w-9 h-9 rounded-lg border border-paper/15 flex items-center justify-center hover:bg-paper hover:text-ink hover:border-paper transition-colors">
                  <Music2 size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/50 mb-4">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-2 text-sm">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-paper/70 hover:text-paper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/50 mb-4">
              {t('footer.services')}
            </h4>
            {services.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link to="/services" state={{ openServiceSlug: s.slug }} className="text-paper/70 hover:text-paper transition-colors">
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

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/50 mb-4">
              {t('footer.service_area_label')}
            </h4>
            <ul className="space-y-1.5 text-sm text-paper/70">
              {cities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-paper/50">{t('footer.legal')}</p>
          <div className="flex items-center gap-3 text-xs text-paper/60">
            <Link to="/contact" className="hover:text-paper transition-colors">{t('nav.contact')}</Link>
            <span className="text-paper/20">·</span>
            <Link to="/quote" className="hover:text-paper transition-colors">{t('nav.quote')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}