import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Check, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/ui/PageHero'
import { CTA } from '@/components/sections/CTA'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_BASE_URL } from '@/config'

export const AboutPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()

  const values = [
    { title: t('about.value_1_title'), desc: t('about.value_1_desc'), color: '#06B6D4' },
    { title: t('about.value_2_title'), desc: t('about.value_2_desc'), color: '#8B5CF6' },
    { title: t('about.value_3_title'), desc: t('about.value_3_desc'), color: '#D946EF' },
    { title: t('about.value_4_title'), desc: t('about.value_4_desc'), color: '#F97316' },
  ]

  const team = [
    { name: 'Carlos Diaz', role: 'Founder · Senior Painter', img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=85' },
    { name: 'Sofía Martín', role: 'Lead Muralist', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=85' },
    { name: 'Daniel Reyes', role: 'Epoxy Specialist', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f8d?w=400&auto=format&fit=crop&q=85' },
    { name: 'Maya Patel', role: 'Project Director', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=85' },
  ]

  return (
    <>
      <Helmet>
        <title>{lang === 'es' ? 'Nosotros | CSD Good Services' : 'About | CSD Good Services'}</title>
        <link rel="canonical" href={`${APP_BASE_URL}/about`} />
      </Helmet>

      <PageHero
        title={lang === 'es' ? 'Una empresa nacida' : 'A studio born from'}
        accent={lang === 'es' ? 'de la pasión.' : 'obsession.'}
      />

      {/* Story */}
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
                  src="https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1600&auto=format&fit=crop&q=85"
                  alt="Mural artist at work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 bg-cream">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-display-md tracking-tight">
              {lang === 'es' ? 'Lo que defendemos' : 'What we stand for'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-canvas p-8 lg:p-10"
              >
                <div
                  className="w-12 h-12 rounded-full mb-5 flex items-center justify-center"
                  style={{ background: `${v.color}15` }}
                >
                  <Check size={20} style={{ color: v.color }} strokeWidth={2.5} />
                </div>
                <h3 className="font-serif text-2xl tracking-tight mb-2">{v.title}</h3>
                <p className="text-sm text-charcoal/80 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-display-md tracking-tight">
              {lang === 'es' ? 'El equipo' : 'The team'}
            </h2>
            <p className="mt-4 text-charcoal/80 max-w-lg">
              {lang === 'es'
                ? 'Artesanos senior, cada uno especializado en su disciplina.'
                : 'Senior craftsmen, each specialized in their own craft.'}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-cream mb-4">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-serif text-xl tracking-tight">{m.name}</h3>
                <p className="text-sm text-steel">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
