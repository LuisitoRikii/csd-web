import { useTranslation } from 'react-i18next'
import { Quote, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { testimonialService } from '@/services'

export const Testimonials = () => {
  const { t, i18n } = useTranslation()
  const isEs = i18n.language === 'es'

  const { data: items = [] } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: () => testimonialService.list({ active_only: true, limit: 12 }),
  })

  const hasData = items.length > 0

  return (
    <section className="relative py-16 lg:py-24 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="max-w-2xl mb-10">

          <h2 className="mt-4 font-serif text-display-md tracking-tight text-ink text-balance">
            {t('testimonials.title_l1')}
            <br />
            <span className="italic font-light text-charcoal">{t('testimonials.title_l2')}</span>
          </h2>
        </div>

        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => (
              <figure
                key={it.id}
                className="rounded-lg bg-paper border border-line p-7 flex flex-col min-h-[240px]"
              >
                <Quote size={22} className="text-ink mb-5" strokeWidth={1.4} />
                <blockquote className="font-serif text-lg leading-snug tracking-tight flex-1 text-ink">
                  &ldquo;{it.body}&rdquo;
                </blockquote>
                <figcaption className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                  <span>
                    <span className="block text-xs font-medium text-ink tracking-wide">{it.author}</span>
                    {it.role && (
                      <span className="block text-[10px] text-steel tracking-wide uppercase mt-0.5">
                        {it.role}
                      </span>
                    )}
                  </span>
                  <div className="flex gap-0.5 text-ink">
                    {[...Array(Math.max(0, Math.min(5, it.rating || 0)))].map((_, j) => (
                      <Star key={j} size={12} className="fill-current" />
                    ))}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-paper border border-dashed border-line p-10 lg:p-16 text-center">
            <Quote size={28} className="text-ink mx-auto mb-5" strokeWidth={1.2} />
            <p className="font-serif text-xl lg:text-2xl text-charcoal italic max-w-xl mx-auto leading-snug">
              {t('testimonials.placeholder_body')}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-steel">
              {t('testimonials.placeholder_cta')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}