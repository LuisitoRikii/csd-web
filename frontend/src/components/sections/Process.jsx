import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ClipboardList, MapPin, FileText, Hammer, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { titleKey: 'step_1_title', descKey: 'step_1_desc', icon: ClipboardList, color: '#06B6D4' },
  { titleKey: 'step_2_title', descKey: 'step_2_desc', icon: MapPin, color: '#8B5CF6' },
  { titleKey: 'step_3_title', descKey: 'step_3_desc', icon: FileText, color: '#D946EF' },
  { titleKey: 'step_4_title', descKey: 'step_4_desc', icon: Hammer, color: '#F97316' },
  { titleKey: 'step_5_title', descKey: 'step_5_desc', icon: CheckCircle2, color: '#06B6D4' },
]

export const Process = () => {
  const { t } = useTranslation()

  const steps = STEPS.map((step) => ({
    ...step,
    title: t(`process.${step.titleKey}`),
    desc: t(`process.${step.descKey}`),
  }))

  return (
    <section id="process" className="relative py-32 lg:py-48 bg-cream">
      <div className="container-x relative z-10">
        <div className="max-w-3xl mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display-lg tracking-tight"
          >
            {t('process.title_l1')}
            <br />
            <span className="italic font-light">{t('process.title_l2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-charcoal/80 text-lg"
          >
            {t('process.subtitle')}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line - aligned to the vertical center of the icon circles (w-16 h-16 -> center at 32px = top-8) */}
          <svg
            className="absolute left-0 right-0 top-8 hidden lg:block"
            height="2"
            width="100%"
            preserveAspectRatio="none"
            viewBox="0 0 1440 2"
            aria-hidden="true"
          >
            <motion.line
              x1="0" y1="1" x2="1440" y2="1"
              stroke="#0B0B12"
              strokeWidth="1"
              strokeDasharray="4 6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.8 }}
            />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6 relative">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="text-center lg:text-left">
                    <div
                      className="relative inline-flex w-16 h-16 rounded-full items-center justify-center mb-5 transition-transform duration-500 hover:scale-110"
                      style={{ background: '#FAFAF7', border: `2px solid ${step.color}` }}
                    >
                      <Icon size={20} style={{ color: step.color }} strokeWidth={1.6} />
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink text-paper text-xs font-mono flex items-center justify-center">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl tracking-tight mb-2">{step.title}</h3>
                    <p className="text-sm text-charcoal/70 leading-relaxed max-w-xs mx-auto lg:mx-0">
                      {step.desc}
                    </p>
                  </div>

                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="lg:hidden h-12 w-px bg-line mx-auto my-2" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}