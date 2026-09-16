import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/ui/PageHero'
import { SEO, buildBreadcrumbSchema } from '@/components/ui/SEO'
import { CTA } from '@/components/sections/CTA'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { teamService } from '@/services'
import { useQuery } from '@tanstack/react-query'

export const AboutPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { aboutPage } = useSiteSettings()
  const storyImage = aboutPage.storyImage
  const teamImage = aboutPage.teamImage

  const { data: team = [] } = useQuery({
    queryKey: ['team-public'],
    queryFn: () => teamService.list({ active_only: true, limit: 24 }),
  })

  const valueKeys = [
    { key: 1, color: '#5B2A8F' },
    { key: 2, color: '#A37052' },
    { key: 3, color: '#7DD8BC' },
    { key: 4, color: '#5B2A8F' },
  ]

  const title = lang === 'es' ? 'Sobre CSD | Servicios del Hogar en Miami' : 'About | CSD Good Services'
  const description = lang === 'es'
    ? 'CSD Good Services es una empresa de servicios del hogar en Miami: pintura, remodelación, limpieza y mantenimiento continuo. Un equipo para todo lo que tu casa necesita.'
    : 'CSD Good Services is a Miami home services company for painting, remodeling, cleaning and ongoing maintenance. One team for everything your home needs.'

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/about"
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <PageHero
        title={lang === 'es' ? 'Un equipo' : 'A trusted'}
        accent={lang === 'es' ? 'de confianza para tu hogar.' : 'home services team.'}
      />

      {/* Services we coordinate — replaces the old story block */}
      <section className="py-20 lg:py-32">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-7 lg:sticky lg:top-32">
              <p className="text-xl lg:text-2xl font-serif leading-snug text-charcoal mb-6">
                {t('about.p1')}
              </p>
              <p className="text-base text-charcoal/85 leading-relaxed">
                {t('about.p2')}
              </p>

              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-all"
              >
                {t('hero.cta_primary')}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src={storyImage || "https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1600&auto=format&fit=crop&q=85"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 bg-subtle">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-display-md tracking-tight">
              {t('about.values_heading')}
            </h2>
            <p className="mt-4 text-charcoal/80 max-w-lg">{t('about.values_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {valueKeys.map((v) => (
              <motion.div
                key={v.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: v.key * 0.1 }}
                className="bg-canvas p-8 lg:p-10"
              >
                <div
                  className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                  style={{ background: `${v.color}15` }}
                >
                  <Check size={20} style={{ color: v.color }} strokeWidth={2.5} />
                </div>
                <h3 className="font-serif text-2xl tracking-tight mb-2">
                  {t(`about.value_${v.key}_title`)}
                </h3>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  {t(`about.value_${v.key}_desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  )
}
