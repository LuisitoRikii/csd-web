import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <>
      <Helmet><title>404 | CSD</title></Helmet>
      <section className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[20vw] lg:text-[14rem] leading-none tracking-tight"
          >
            404
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-charcoal/80 max-w-md mx-auto"
          >
            We couldn't find the page you're looking for. Let's get you back to the studio.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-paper text-sm">
              Back to home <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
