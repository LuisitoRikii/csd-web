import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, Brush, Palette, Sparkles, Hammer, Home, Building2, Wrench, ClipboardCheck, Box, Construction, Brush as Walls, Sparkle, ChevronRight } from 'lucide-react'
import { serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_BASE_URL } from '@/config'
import { PageHero } from '@/components/ui/PageHero'

const iconMap = {
  Home, Building2, Palette, Sparkles, Brush, Hammer, Wrench, ClipboardCheck, Box, Construction, Walls, Sparkle,
}

export const ServicesPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { data: services = [] } = useQuery({
    queryKey: ['services-all'],
    queryFn: () => serviceService.list({ active_only: true }),
  })

  return (
    <>
      <Helmet>
        <title>{lang === 'es' ? 'Servicios | CSD Good Services' : 'Services | CSD Good Services'}</title>
        <link rel="canonical" href={`${APP_BASE_URL}/services`} />
      </Helmet>

      <PageHero
        title={lang === 'es' ? 'Cada servicio, ejecutado con' : 'Every service, executed with'}
        accent={lang === 'es' ? 'oficio.' : 'craft.'}
        subtitle={t('services.subtitle')}
      />

      <section className="pb-32">
        <div className="container-x">
          {services.length === 0 && (
            <div className="text-center py-32 text-charcoal/60 text-lg">
              {t('common.loading')}
            </div>
          )}

          <div className="space-y-20">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] || Brush
              const title = lang === 'es' ? s.title_es : s.title_en
              const desc = lang === 'es' ? s.description_es : s.description_en
              const longDesc = lang === 'es' ? s.long_description_es : s.long_description_en
              const flip = i % 2 === 1

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    s.image_url ? 'has-image' : ''
                  }`}
                >
                  <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                    <div
                      className="aspect-[4/3] rounded-3xl overflow-hidden bg-cream relative"
                      style={{ background: `${s.color}08` }}
                    >
                      {s.image_url ? (
                        <img src={s.image_url} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center"
                            style={{ background: `${s.color}20`, color: s.color }}
                          >
                            <Icon size={40} strokeWidth={1.5} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                    <h2 className="font-serif text-display-md tracking-tight mb-4">{title}</h2>
                    <p className="text-lg text-charcoal/80 mb-4">{desc}</p>
                    {longDesc && (
                      <p className="text-base text-charcoal/70 leading-relaxed mb-8">{longDesc}</p>
                    )}
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-all"
                    >
                      {t('services.cta_quote')}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 relative rounded-[2rem] bg-ink text-paper p-10 md:p-16 overflow-hidden"
          >
            <div
              className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle, #D946EF 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h3 className="font-serif text-display-md tracking-tight">
                  {lang === 'es' ? '¿Listo para' : 'Ready to'}{' '}
                  <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-magenta">
                    {lang === 'es' ? 'transformar' : 'transform'}
                  </span>{' '}
                  {lang === 'es' ? 'tu espacio?' : 'your space?'}
                </h3>
                <p className="mt-3 text-paper/70 max-w-xl">
                  {lang === 'es'
                    ? 'Cuéntanos sobre tu proyecto y respondemos en menos de 24 horas.'
                    : "Tell us about your project and we'll respond within 24 hours."}
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-paper text-ink text-sm font-medium hover:bg-cyan hover:text-paper transition-all"
                >
                  {t('hero.cta_primary')}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
