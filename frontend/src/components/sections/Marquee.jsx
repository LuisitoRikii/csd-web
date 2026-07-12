import { useTranslation } from 'react-i18next'

export const Marquee = () => {
  const { t } = useTranslation()
  const items = t('marquee', { returnObjects: true })

  return (
    <section className="relative py-12 lg:py-16 bg-canvas border-y border-line/60 overflow-hidden">
      <div className="marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-10 px-8 text-3xl lg:text-5xl font-serif tracking-tight"
          >
            <span className="text-ink">{item}</span>
            <span className="text-ink/15">·</span>
          </div>
        ))}
      </div>
    </section>
  )
}
