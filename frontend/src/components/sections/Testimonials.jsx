import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Quote, Star } from 'lucide-react'

export const Testimonials = () => {
  const { t } = useTranslation()
  const items = [
    { quote: t('testimonials.t1'), author: t('testimonials.t1_author') },
    { quote: t('testimonials.t2'), author: t('testimonials.t2_author') },
    { quote: t('testimonials.t3'), author: t('testimonials.t3_author') },
  ]

  return (
    <section className="relative py-32 lg:py-48 bg-canvas">
      <div className="container-x relative z-10">
        <div className="max-w-2xl mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display-lg tracking-tight"
          >
            {t('testimonials.title_l1')}
            <br />
            <span className="italic font-light">{t('testimonials.title_l2')}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group bento-tile p-10 min-h-[320px] flex flex-col"
            >
              <Quote
                size={28}
                className="text-magenta mb-6 transition-transform duration-500 group-hover:rotate-6"
                strokeWidth={1.5}
              />

              <blockquote className="font-serif text-xl lg:text-2xl leading-snug tracking-tight flex-1">
                {it.quote}
              </blockquote>

              <figcaption className="mt-8 pt-6 border-t border-line flex items-center justify-between">
                <span className="text-sm font-medium tracking-wide">{it.author}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
