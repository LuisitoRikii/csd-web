import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Brush, Palette, Sparkles, Hammer, Home, Building2, Wrench, ClipboardCheck, Box, Construction, Brush as Walls, Sparkle, ChevronRight, Images } from 'lucide-react'
import { serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { SEO, buildBreadcrumbSchema } from '@/components/ui/SEO'
import { ServiceGalleryModal } from '@/components/ui/ServiceGalleryModal'

const iconMap = {
  Home, Building2, Palette, Sparkles, Brush, Hammer, Wrench, ClipboardCheck, Box, Construction, Walls, Sparkle,
}

export const ServicesPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [activeService, setActiveService] = useState(null)
  const { data: services = [] } = useQuery({
    queryKey: ['services-all'],
    queryFn: () => serviceService.list({ active_only: true }),
  })

  const title = lang === 'es' ? 'Servicios | CSD Good Services' : 'Services | CSD Good Services'
  const description = lang === 'es'
    ? 'Servicios de pintura interior y exterior, resina epóxica, murales personalizados, remodelación, reparaciones y limpieza en Miami. Cotización gratis.'
    : 'Interior & exterior painting, epoxy resin floors and countertops, custom murals, home remodeling, repairs and cleaning in Miami. Free quotes.'

  const serviceSchema = services.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: lang === 'es' ? s.title_es : s.title_en,
        description: lang === 'es' ? s.description_es : s.description_en,
        provider: { '@type': 'GeneralContractor', name: 'CSD Good Services' },
        areaServed: { '@type': 'City', name: 'Miami' },
      },
    })),
  } : null

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/services"
        schema={serviceSchema || buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />

      <PageHero
        title={t('services_page.title')}
        subtitle={t('services_page.subtitle')}
      />

      <section className="pb-32">
        <div className="container-x">
          {services.length === 0 && (
            <div className="text-center py-32 text-charcoal/60 text-lg">
              {t('services_page.no_services')}
            </div>
          )}

          <div className="space-y-20">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] || Brush
              const title = lang === 'es' ? s.title_es : s.title_en
              const desc = lang === 'es' ? s.description_es : s.description_en
              const longDesc = lang === 'es' ? s.long_description_es : s.long_description_en
              const flip = i % 2 === 1
              const galleryCount = (s.projects || []).length

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setActiveService(s)}
                      aria-label={lang === 'es'
                        ? `Abrir galería de ${s.title_es}`
                        : `Open gallery for ${s.title_en}`}
                      className="group block w-full aspect-[4/3] rounded-3xl overflow-hidden bg-subtle relative text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
                      style={{ background: `${s.color}08` }}
                    >
                      {s.image_url ? (
                        <img
                          src={s.image_url}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center"
                            style={{ background: `${s.color}20`, color: s.color }}
                          >
                            <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
                          </div>
                        </div>
                      )}

                      {galleryCount > 0 && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper/95 backdrop-blur text-ink text-[11px] uppercase tracking-[0.16em] font-semibold">
                          <Images size={11} aria-hidden="true" />
                          {lang === 'es' ? `Ver galería · ${galleryCount}` : `View gallery · ${galleryCount}`}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                    <h2 className="font-serif text-display-md tracking-tight mb-4">{title}</h2>
                    <p className="text-lg text-charcoal/80 mb-4">{desc}</p>
                    {longDesc && (
                      <p className="text-base text-charcoal/70 leading-relaxed mb-8">{longDesc}</p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {galleryCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveService(s)}
                          className="btn-primary"
                        >
                          <Images size={14} aria-hidden="true" />
                          {t('services.view_gallery')}
                          <span className="opacity-70 tabular-nums">{galleryCount}</span>
                        </button>
                      )}
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-ink hover:text-paper hover:border-ink transition-all"
                      >
                        {t('services.cta_quote')}
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 relative rounded-[2rem] bg-ink text-paper p-10 md:p-16 overflow-hidden"
          >
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h3 className="font-serif text-display-md tracking-tight">
                  {t('hero.cta_primary')}
                </h3>
                <p className="mt-3 text-paper/70 max-w-xl">
                  {t('hero.description')}
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-paper text-ink text-sm font-medium hover:bg-graphite transition-all"
                >
                  {t('hero.cta_primary')}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ServiceGalleryModal
        service={activeService}
        open={!!activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  )
}
