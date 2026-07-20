import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MessageCircle, Mail, Phone } from 'lucide-react'
import { WHATSAPP_NUMBER, BUSINESS } from '@/config'
import { RevealText } from '@/components/ui/RevealText'

export const CTA = () => {
  const { t } = useTranslation()
  const phoneClean = BUSINESS.phone.replace(/[^+\d]/g, '')
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hi CSD, I would like to request a free estimate for my project.'
  )}`

  return (
    <section className="relative py-24 lg:py-36 bg-canvas">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2rem] bg-ink text-paper overflow-hidden isolate"
        >
          {/* Top tri-color accent stripe — the brand's signature */}
          <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-1 bg-gradient-spectrum" />

          <div className="relative px-8 py-16 md:px-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-serif text-display-lg tracking-tight text-paper leading-[1.05] text-balance">
                  <RevealText as="span" text={t('cta.title_l1')} staggerChildren={0.06} />
                  <br />
                  <RevealText
                    as="span"
                    text={t('cta.title_l2')}
                    staggerChildren={0.06}
                    delay={0.18}
                    className="italic font-light text-paper/70"
                  />
                </h2>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="mt-6 text-paper/70 max-w-xl text-lg leading-relaxed"
                >
                  {t('cta.subtitle')}
                </motion.p>
              </div>

              <div className="lg:col-span-5">
                <div className="flex flex-col gap-3">
                  <Link
                    to="/quote"
                    className="btn-primary justify-center w-full"
                  >
                    {t('cta.primary')} <ArrowUpRight size={16} />
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-paper/25 text-paper font-medium text-sm tracking-wide hover:bg-paper/10 transition-all w-full"
                  >
                    <MessageCircle size={14} />
                    {t('cta.secondary_whatsapp')}
                  </a>
                  <a
                    href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent('Free estimate request')}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-paper/15 text-paper/90 font-medium text-sm tracking-wide hover:bg-paper/5 transition-all w-full"
                  >
                    <Mail size={14} />
                    {t('cta.secondary_email')} · {BUSINESS.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phone + email direct strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-paper border border-line"
        >
          <a
            href={`tel:${phoneClean}`}
            className="group flex items-center gap-4 flex-1"
          >
            <div className="w-11 h-11 rounded-full bg-mint text-ink flex items-center justify-center shrink-0 group-hover:shadow-glow-mint transition-shadow">
              <Phone size={17} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-steel font-semibold">
                Prefer to call?
              </p>
              <p className="font-serif text-xl text-ink group-hover:text-violet transition-colors">
                {BUSINESS.phone}
              </p>
            </div>
          </a>

          <a
            href={`mailto:${BUSINESS.email}`}
            className="group flex items-center gap-4 flex-1"
          >
            <div className="w-11 h-11 rounded-full bg-magenta-tint text-magenta flex items-center justify-center shrink-0 group-hover:bg-magenta group-hover:text-paper transition-colors">
              <Mail size={17} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-steel font-semibold">
                Or write to us
              </p>
              <p className="font-serif text-xl text-ink group-hover:text-magenta transition-colors break-all">
                {BUSINESS.email}
              </p>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
