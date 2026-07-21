import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <section className="relative py-24 lg:py-36 bg-subtle">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-display-lg tracking-tight text-ink text-balance"
          >
            {t('testimonials.title_l1')}
            <br />
            <span className="italic font-light text-charcoal">{t('testimonials.title_l2')}</span>
          </motion.h2>
        </div>

        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it, idx) => (
              <motion.figure
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08, duration: 0.8 }}
                className="rounded-2xl bg-paper border border-line p-8 flex flex-col min-h-[260px]"
              >
                <Quote size={24} className="text-violet mb-5" strokeWidth={1.4} />
                <blockquote className="font-serif text-lg leading-snug tracking-tight flex-1 text-charcoal">
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
                  <div className="flex gap-0.5 text-magenta">
                    {[...Array(Math.max(0, Math.min(5, it.rating || 0)))].map((_, j) => (
                      <Star key={j} size={14} className="fill-current" />
                    ))}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-paper border border-line/60 border-dashed p-12 lg:p-20 text-center"
          >
            <Quote size={32} className="text-violet mx-auto mb-6" strokeWidth={1.2} />
            <p className="font-serif text-xl lg:text-2xl text-charcoal italic max-w-xl mx-auto leading-snug">
              {isEs
                ? 'Pronto agregaremos aquí las palabras reales de nuestros clientes.'
                : 'Real client words coming soon — we add them as they come in.'}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-steel">
              {isEs
                ? 'Agrega reseñas desde el panel para verlas aquí.'
                : 'Add reviews from the admin to see them here.'}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}