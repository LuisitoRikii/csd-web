import { useTranslation } from 'react-i18next'
import { ClipboardList, FileText, Hammer, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { titleKey: 'step_1_title', descKey: 'step_1_desc', Icon: ClipboardList },
  { titleKey: 'step_2_title', descKey: 'step_2_desc', Icon: FileText },
  { titleKey: 'step_3_title', descKey: 'step_3_desc', Icon: Hammer },
  { titleKey: 'step_4_title', descKey: 'step_4_desc', Icon: CheckCircle2 },
]

export const Process = () => {
  const { t } = useTranslation()

  return (
    <section id="process" className="relative py-16 lg:py-24 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="max-w-3xl mb-10">
          <h2 className="font-serif text-display-md tracking-tight text-ink text-balance">
            {t('process.title_l1')}
            <br />
            <span className="italic font-light text-charcoal">{t('process.title_l2')}</span>
          </h2>
          <p className="mt-4 text-steel text-base lg:text-lg max-w-2xl leading-relaxed">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {STEPS.map((step, i) => {
            const Icon = step.Icon
            return (
              <div key={step.titleKey} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="inline-flex w-12 h-12 rounded-lg items-center justify-center bg-muted text-ink">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <span className="font-mono text-xs text-steel tracking-[0.18em]">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-serif text-xl tracking-tight text-ink leading-snug">
                  {t(`process.${step.titleKey}`)}
                </h3>
                <p className="mt-2 text-sm text-steel leading-relaxed">
                  {t(`process.${step.descKey}`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}