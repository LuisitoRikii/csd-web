import { motion } from 'framer-motion'

export const PageHero = ({ title, subtitle, accent }) => {
  return (
    <section className="pt-40 pb-16 bg-canvas">
      <div className="container-x">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-display-lg tracking-tight max-w-4xl text-ink"
        >
          {title}{' '}
          {accent && (
            <span className="italic font-light text-brand">{accent}</span>
          )}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-charcoal/80 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
