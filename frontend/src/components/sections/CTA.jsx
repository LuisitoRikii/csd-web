import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/config'

export const CTA = () => {
  const { t } = useTranslation()

  return (
    <section className="relative py-32 lg:py-44 bg-canvas overflow-hidden">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] bg-ink text-paper p-10 md:p-16 lg:p-24 overflow-hidden"
        >
          {/* Gradient background blobs */}
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, #D946EF 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
          />

          <div className="relative max-w-4xl">
            <h2 className="font-serif text-display-lg tracking-tight text-paper leading-[1.05]">
              {t('cta.title_l1')}
              <br />
              <span className="italic font-light bg-clip-text text-transparent bg-gradient-to-r from-cyan via-violet to-magenta">
                {t('cta.title_l2')}
              </span>
            </h2>

            <p className="mt-6 text-paper/70 max-w-xl text-lg leading-relaxed">
              {t('cta.subtitle')}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-paper text-ink text-sm font-medium hover:bg-cyan hover:text-paper transition-all"
              >
                {t('cta.primary')}
                <ArrowUpRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-paper/30 text-paper text-sm font-medium hover:bg-paper/10 transition-all"
              >
                {t('cta.secondary')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
