import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/ui/SEO'

export const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <SEO title={`${t('not_found.title')} | CSD Good Services`} path="/404" noindex />
      <section className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[20vw] lg:text-[14rem] leading-none tracking-tight"
          >
            {t('not_found.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-charcoal/80 max-w-md mx-auto"
          >
            {t('not_found.message')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link to="/" className="btn-primary">
              {t('not_found.cta')} <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
