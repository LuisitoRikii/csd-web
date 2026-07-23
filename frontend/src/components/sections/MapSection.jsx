import { useTranslation } from 'react-i18next'
import { MapPin, Navigation, Phone, Mail, Clock } from 'lucide-react'
import { BUSINESS } from '@/config'
import { FadeUp, FadeStagger, FadeStaggerItem } from '@/components/ui/Reveal'

export const MapSection = () => {
  const { t } = useTranslation()

  const phoneCards = (BUSINESS.phones || [BUSINESS.phone]).map((ph) => ({
    icon: Phone,
    content: ph,
    isLink: true,
    href: `tel:${ph.replace(/[^+\d]/g, '')}`,
  }))

  const cards = [
    { icon: MapPin, content: BUSINESS.address, isLink: false },
    ...phoneCards,
    { icon: Mail, content: BUSINESS.email, isLink: true, href: `mailto:${BUSINESS.email}`, break: true },
    { icon: Clock, content: BUSINESS.hours, isLink: false },
  ]

  return (
    <section className="relative py-16 lg:py-24 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start mb-8">
          <FadeUp className="lg:col-span-2">
            <h2 className="mt-4 font-serif text-display-md tracking-tight text-ink text-balance">
              {t('service_area.title')}
            </h2>
            <p className="mt-4 text-steel max-w-2xl text-base lg:text-lg leading-relaxed">
              {t('service_area.subtitle')}
            </p>
          </FadeUp>
          <FadeStagger className="space-y-3" staggerDelay={0.06}>
            {cards.map((card, idx) => {
              const Icon = card.icon
              const inner = (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-paper border border-line hover:border-ink/30 transition-colors">
                  <Icon size={16} className="mt-0.5 text-ink shrink-0" />
                  <span className={`text-ink text-sm ${card.break ? 'break-all' : ''}`}>
                    {card.content}
                  </span>
                </div>
              )
              return (
                <FadeStaggerItem key={idx}>
                  {card.isLink ? <a href={card.href}>{inner}</a> : inner}
                </FadeStaggerItem>
              )
            })}
            <a
              href="https://maps.google.com/?q=8215+NW+64th+Street+Medley+FL+33166"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-ink text-paper text-sm font-medium hover:bg-graphite transition-colors w-full"
            >
              <Navigation size={14} />
              {t('service_area.directions_cta')}
            </a>
          </FadeStagger>
        </div>

        <FadeUp y={16} delay={0.2}>
        <div className="relative aspect-[16/7] rounded-lg overflow-hidden border border-line">
          <iframe
            title="CSD Good Services Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.7!2d-80.325!3d25.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b1234567890%3A0x0!2s8215%20NW%2064th%20St%2C%20Medley%2C%20FL%2033166!5e0!3m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        </FadeUp>
      </div>
    </section>
  )
}