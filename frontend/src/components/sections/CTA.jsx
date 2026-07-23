import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MessageCircle, Mail, Phone } from 'lucide-react'
import { WHATSAPP_NUMBER, BUSINESS } from '@/config'

export const CTA = () => {
  const { t } = useTranslation()
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello CSD Good Services LLC, I would like to schedule a free estimate.'
  )}`

  return (
    <section className="relative py-16 lg:py-24 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="relative rounded-lg bg-ink text-paper overflow-hidden">
          <div className="relative px-8 py-14 md:px-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-paper/60">
                  {t('cta.eyebrow')}
                </p>
                <h2 className="mt-4 font-serif text-display-md tracking-tight text-paper text-balance leading-[1.1]">
                  {t('cta.title_l1')}
                  <br />
                  <span className="italic font-light text-paper/70">
                    {t('cta.title_l2')}
                  </span>
                </h2>
                <p className="mt-5 text-paper/70 max-w-xl text-base lg:text-lg leading-relaxed">
                  {t('cta.subtitle')}
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="flex flex-col gap-3">
                  <Link to="/quote" className="btn-light justify-center w-full group">
                    {t('cta.primary')} <ArrowUpRight size={16} />
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg border border-paper/25 text-paper font-medium text-sm tracking-wide hover:bg-paper/10 transition-colors w-full"
                  >
                    <MessageCircle size={14} />
                    {t('cta.secondary_whatsapp')}
                  </a>
                  <a
                    href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent('Free estimate request')}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg border border-paper/15 text-paper/90 font-medium text-sm tracking-wide hover:bg-paper/5 transition-colors w-full"
                  >
                    <Mail size={14} />
                    {t('cta.secondary_email')} · {BUSINESS.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-5 rounded-lg bg-paper border border-line">
          {(BUSINESS.phones || [BUSINESS.phone]).map((ph) => (
            <a
              key={ph}
              href={`tel:${ph.replace(/[^+\d]/g, '')}`}
              className="group flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-lg bg-subtle text-ink border border-line flex items-center justify-center shrink-0 transition-colors">
                <Phone size={17} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-steel font-medium">
                  {t('footer.phone_label')}
                </p>
                <p className="font-serif text-xl text-ink group-hover:text-charcoal transition-colors">
                  {ph}
                </p>
              </div>
            </a>
          ))}

          <a href={`mailto:${BUSINESS.email}`} className="group flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-subtle text-ink border border-line flex items-center justify-center shrink-0 transition-colors">
              <Mail size={17} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-steel font-medium">
                {t('footer.email_label')}
              </p>
              <p className="font-serif text-xl text-ink group-hover:text-charcoal transition-colors break-all">
                {BUSINESS.email}
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}