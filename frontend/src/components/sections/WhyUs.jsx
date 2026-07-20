import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Clock4, Wallet } from 'lucide-react'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

const ACCENTS = ['mint', 'violet', 'magenta']

const REASONS = [
  {
    Icon: ShieldCheck,
    title_en: 'Licensed & insured',
    title_es: 'Licenciados y asegurados',
    body_en: 'Full general contracting license and liability coverage on every project.',
    body_es: 'Licencia completa de contratista general y cobertura de responsabilidad.',
  },
  {
    Icon: Clock4,
    title_en: 'Respect for your time',
    title_es: 'Respeto por tu tiempo',
    body_en: 'Crews arrive on time, workdays are scheduled and timelines are written.',
    body_es: 'Equipos puntuales, jornadas planificadas y plazos por escrito.',
  },
  {
    Icon: Wallet,
    title_en: 'Transparent pricing',
    title_es: 'Precios transparentes',
    body_en: 'Itemized quotes. No hidden fees. Change orders you actually approve.',
    body_es: 'Cotizaciones por ítems. Sin cargos ocultos. Cambios que apruebas.',
  },
]

const ACCENT_BG = {
  mint:    'bg-mint',
  violet:  'bg-violet',
  magenta: 'bg-magenta',
}

const ACCENT_TEXT = {
  mint:    'text-mint-deep',
  violet:  'text-violet',
  magenta: 'text-magenta',
}

export const WhyUs = () => {
  const { i18n } = useTranslation()
  const isEs = i18n.language === 'es'

  return (
    <section className="relative py-24 lg:py-36">
      <div className="container-x">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <motion.h2
            {...fade}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display-lg tracking-tight text-ink text-balance"
          >
            Built for homeowners
            <br />
            <span className="italic font-light text-charcoal">who care about details.</span>
          </motion.h2>
          <motion.p
            {...fade}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-charcoal/80 text-lg max-w-2xl leading-relaxed"
          >
            We are a small, dedicated team with ten years on the tools. Every project is led by
            senior craftsmen, scheduled tightly, and finished clean. That's why most of our
            work still comes through referrals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-12 lg:gap-x-14">
          {REASONS.map((r, i) => {
            const Icon = r.Icon
            const accent = ACCENTS[i]
            return (
              <motion.div
                key={r.title_en}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.05 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className="relative h-[2px] w-full bg-line/60 overflow-hidden mb-6 rounded-full">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: 0.25 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute inset-y-0 left-0 w-full origin-left ${ACCENT_BG[accent]}`}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    strokeWidth={1.6}
                    className="text-ink transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                  />
                  <h3 className="font-serif text-xl tracking-tight text-ink leading-tight">
                    {isEs ? r.title_es : r.title_en}
                  </h3>
                </div>

                <p className="mt-3 text-sm text-charcoal/75 leading-relaxed max-w-[34ch] sm:max-w-none">
                  {isEs ? r.body_es : r.body_en}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}