import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ClipboardList, MapPin, FileText, Hammer, CheckCircle2 } from 'lucide-react'

// The process flows through the tri-color spectrum: mint → violet → magenta → violet → mint
const STEPS = [
  { titleKey: 'step_1_title', descKey: 'step_1_desc', Icon: ClipboardList, color: '#91F2D7', tone: 'mint' },
  { titleKey: 'step_2_title', descKey: 'step_2_desc', Icon: MapPin,       color: '#8A04F0', tone: 'violet' },
  { titleKey: 'step_3_title', descKey: 'step_3_desc', Icon: FileText,     color: '#D925A9', tone: 'magenta' },
  { titleKey: 'step_4_title', descKey: 'step_4_desc', Icon: Hammer,       color: '#8A04F0', tone: 'violet' },
  { titleKey: 'step_5_title', descKey: 'step_5_desc', Icon: CheckCircle2, color: '#91F2D7', tone: 'mint' },
]

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

export const Process = () => {
  const { t } = useTranslation()

  return (
    <section id="process" className="relative py-24 lg:py-36">
      <div className="container-x">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <motion.h2
            {...fade}
            className="font-serif text-display-lg tracking-tight text-ink text-balance"
          >
            {t('process.title_l1')}
            <br />
            <span className="italic font-light text-charcoal">{t('process.title_l2')}</span>
          </motion.h2>
          <motion.p
            {...fade}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-charcoal/80 text-lg max-w-2xl leading-relaxed"
          >
            {t('process.subtitle')}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Flowing gradient connector — the spectrum line behind the icons */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden lg:block h-[2px] bg-gradient-spectrum rounded-full opacity-90"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative">
            {STEPS.map((step, i) => {
              const Icon = step.Icon
              return (
                <motion.div
                  key={step.titleKey}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="text-center lg:text-left">
                    <div className="relative inline-block mb-5">
                      <div
                        className="relative inline-flex w-16 h-16 rounded-full items-center justify-center bg-paper transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        style={{
                          border: `2px solid ${step.color}`,
                          boxShadow: `0 8px 24px -10px ${step.color}80`,
                        }}
                      >
                        <Icon size={20} style={{ color: step.color }} strokeWidth={1.8} />
                      </div>
                      {/* Step number badge — spectrum gradient */}
                      <span
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-paper text-xs font-mono flex items-center justify-center bg-gradient-spectrum shadow-soft"
                        aria-hidden="true"
                      >
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl tracking-tight text-ink mb-2">
                      {t(`process.${step.titleKey}`)}
                    </h3>
                    <p className="text-sm text-charcoal/75 leading-relaxed max-w-xs mx-auto lg:mx-0">
                      {t(`process.${step.descKey}`)}
                    </p>
                  </div>

                  {/* Mobile connector — gradient line that mirrors the spectrum */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="lg:hidden h-12 w-[2px] mx-auto my-2 rounded-full"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(180deg, #91F2D7, #8A04F0)'
                          : i === 1
                            ? 'linear-gradient(180deg, #8A04F0, #D925A9)'
                            : i === 2
                              ? 'linear-gradient(180deg, #D925A9, #8A04F0)'
                              : 'linear-gradient(180deg, #8A04F0, #91F2D7)',
                      }}
                    />
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
