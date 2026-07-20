import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Navigation, Phone, Mail } from 'lucide-react'
import { BUSINESS } from '@/config'

export const MapSection = () => {
  const { t } = useTranslation()
  const phoneClean = BUSINESS.phone.replace(/[^+\d]/g, '')

  const cards = [
    {
      icon: MapPin,
      content: BUSINESS.address,
      isLink: false,
    },
    {
      icon: Phone,
      content: BUSINESS.phone,
      isLink: true,
      href: `tel:${phoneClean}`,
    },
    {
      icon: Mail,
      content: BUSINESS.email,
      isLink: true,
      href: `mailto:${BUSINESS.email}`,
      break: true,
    },
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-subtle">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mb-12">
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mt-4 font-serif text-display-md tracking-tight text-ink"
            >
              {t('service_area.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 text-charcoal/80 max-w-2xl"
            >
              {t('service_area.subtitle')}
            </motion.p>
          </div>
          <div className="space-y-3">
            {cards.map((card, idx) => {
              const Icon = card.icon
              const inner = (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-paper border border-line hover:border-ink/30 transition-colors">
                  <Icon size={18} className="mt-0.5 text-violet shrink-0" />
                  <span className={`text-charcoal text-sm ${card.break ? 'break-all' : ''}`}>
                    {card.content}
                  </span>
                </div>
              )
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: idx * 0.08, duration: 0.7 }}
                >
                  {card.isLink ? <a href={card.href}>{inner}</a> : inner}
                </motion.div>
              )
            })}
            <a
              href="https://maps.google.com/?q=8215+NW+64th+Street+Medley+FL+33166"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-colors w-full"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-[16/7] rounded-3xl overflow-hidden border border-line"
        >
          <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1 z-10 bg-gradient-spectrum" />
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
        </motion.div>
      </div>
    </section>
  )
}
