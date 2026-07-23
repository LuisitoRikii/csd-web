import { useTranslation } from 'react-i18next'
import { FadeUp } from '@/components/ui/Reveal'

export const Marquee = () => {
  const { t } = useTranslation()
  const items = t('marquee', { returnObjects: true })

  return (
    <section className="relative py-8 lg:py-10 bg-canvas border-y border-line overflow-hidden">
      <FadeUp y={12} duration={0.6}>
        <div className="relative marquee whitespace-nowrap">
          {[...items, ...items, ...items].map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-10 px-8 text-xl lg:text-2xl font-serif tracking-tight text-ink"
            >
              <span>{item}</span>
              <span className="text-silver">·</span>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  )
}