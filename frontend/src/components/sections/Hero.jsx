import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const HERO_VIDEO =
  'https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4'
const HERO_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1559563458-527698bf5295?w=2400&auto=format&fit=crop&q=85'

export const Hero = () => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const videoRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] w-full overflow-hidden bg-canvas">
      {/* Background media */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
            poster={HERO_FALLBACK_IMG}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <img
            src={HERO_FALLBACK_IMG}
            alt="Artist painting a mural"
            className="w-full h-full object-cover"
          />
        )}
        {/* Subtle dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/15 to-canvas" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-20 h-full container-x flex flex-col justify-end pb-24 lg:pb-32"
        style={{ opacity, y: titleY }}
      >
        <h1 className="font-serif text-paper text-display-xl max-w-6xl tracking-tight">
          <motion.span
            className="block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.title_l1')}
          </motion.span>
          <motion.span
            className="block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.title_l2')}{' '}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-magenta">
              {t('hero.title_l3')}
            </span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-paper/90 text-base lg:text-lg leading-relaxed"
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap gap-3 mt-10"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-paper text-ink text-sm font-medium tracking-wide hover:bg-paper/90 transition-all shadow-lift"
          >
            {t('hero.cta_primary')}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-transparent text-paper border border-paper/40 text-sm font-medium tracking-wide hover:bg-paper/10 transition-all backdrop-blur-sm"
          >
            {t('hero.cta_secondary')}
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-0 inset-x-0 z-20 border-t border-paper/15 backdrop-blur-md bg-ink/30"
        style={{ opacity }}
      >
        <div className="container-x py-5 flex flex-wrap items-center justify-between gap-4 text-paper text-xs">
          <span className="tracking-[0.18em] uppercase opacity-80">{t('hero.subtitle')}</span>
          <a href="#about" className="group flex items-center gap-2 hover:gap-3 transition-all">
            <span className="tracking-[0.18em] uppercase opacity-80">{t('hero.scroll')}</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </motion.div>

      {/* Color accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-30 flex">
        <div className="flex-1 bg-cyan" />
        <div className="flex-1 bg-violet" />
        <div className="flex-1 bg-magenta" />
      </div>
    </section>
  )
}
