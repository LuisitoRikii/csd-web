import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Brush, Palette, Sparkles, Hammer, Home, Building2, Wrench, ClipboardCheck, Box, Construction, Brush as Walls, Sparkle, ChevronRight } from 'lucide-react'
import { serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { VerticalBrushConnector } from '@/components/svg/PaintConnectors'

const iconMap = {
  Home, Building2, Palette, Sparkles, Brush, Hammer, Wrench, ClipboardCheck, Box, Construction, Walls, Sparkle,
}

export const Services = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.list(),
  })

  return (
    <section id="services" className="relative py-32 lg:py-48 bg-ink text-paper">
      <VerticalBrushConnector
        align="right"
        offsetX={-6}
        color="#06B6D4"
        topOffset={-300}
        travel={700}      // ahora baja más SIN desincronizarse
        width={305}
        opacity={0.9}
        scrollRatio={2.1}  // subí a 2.6-3 si lo sentís rápido, bajá a 1.6-1.8 si lo sentís lento
      />
      <div className="container-x relative z-10">
        <div className="max-w-3xl mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display-lg tracking-tight text-paper"
          >
            {t('services.title_l1')}
            <br />
            <span className="italic font-light">{t('services.title_l2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-paper/70 text-lg max-w-2xl leading-relaxed"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-paper/10 border border-paper/10 rounded-3xl overflow-hidden">
          {services.slice(0, 9).map((s, i) => {
            const Icon = iconMap[s.icon] || Brush
            const title = lang === 'es' ? s.title_es : s.title_en
            const desc = lang === 'es' ? s.description_es : s.description_en

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-ink p-8 lg:p-10 transition-all duration-700 ease-smooth hover:bg-graphite overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-12">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: `${s.color}20`, color: s.color }}
                    >
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    <span className="text-paper/30 text-sm font-mono">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl lg:text-3xl tracking-tight text-paper mb-3 transition-colors group-hover:text-cyan">
                    {title}
                  </h3>
                  <p className="text-paper/70 text-sm leading-relaxed mb-6">
                    {desc}
                  </p>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-paper/50 group-hover:text-cyan transition-colors"
                  >
                    {t('services.cta_quote')}
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>

                  {/* Hover paint splash */}
                  <div
                    className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700"
                    style={{ background: `${s.color}40` }}
                  />
                </div>

                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: s.color }}
                />
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-paper text-ink text-sm font-medium hover:bg-cyan hover:text-paper transition-all"
          >
            {t('services.view_all')}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
