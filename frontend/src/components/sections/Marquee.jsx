import { useTranslation } from 'react-i18next'

export const Marquee = () => {
  const { t } = useTranslation()
  const items = t('marquee', { returnObjects: true })

  return (
    <section
      className="relative py-10 lg:py-14 text-paper overflow-hidden"
      style={{ background: 'linear-gradient(95deg, #91F2D7 0%, #8A04F0 50%, #D925A9 100%)' }}
    >
      {/* Subtle grain for depth on top of the gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")",
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="relative marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-10 px-8 text-2xl lg:text-4xl font-serif tracking-tight"
          >
            <span className="text-paper">{item}</span>
            <span className="text-paper/40">·</span>
          </div>
        ))}
      </div>
    </section>
  )
}
