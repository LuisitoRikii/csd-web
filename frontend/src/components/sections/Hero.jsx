import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

// These fallbacks are sourced from the backend `media` settings (hero_*_fallback_url).
// They are used only when the admin hasn't uploaded custom media yet.
const HERO_FALLBACK_IMG = '/xdd.png'

// Textura de grano en SVG (feTurbulence), codificada como data URI para no depender de un archivo externo
const GRAIN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
`)}`

export const IMG = {
  paintingInterior: '/xl.jpg',
}

export const VIDEOS = {
  renovation: 'https://cdn.pixabay.com/video/2022/03/27/113049-693920814_large.mp4',
  painters: 'https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4',
  construction: 'https://cdn.pixabay.com/video/2018/11/25/19449-303154154_large.mp4',
  epoxy: 'https://cdn.pixabay.com/video/2022/03/27/113049-693920814_large.mp4',
  painting: 'https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4',
}

export const Hero = () => {
  const { t } = useTranslation()
  const { hero, raw } = useSiteSettings()
  const ref = useRef(null)
  const videoRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const [videoError, setVideoError] = useState(false)
  const videoUrl = raw && 'hero_video_url' in raw ? hero.videoUrl : (hero.videoUrl || hero.videoFallbackUrl)
  const fallbackImage = hero.imageUrl || hero.imageFallbackUrl || HERO_FALLBACK_IMG

  useEffect(() => {
    setVideoError(false)
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [videoUrl])

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] w-full overflow-hidden bg-canvas">
      {/* Background media */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        {videoUrl && !videoError ? (
          <video
            key={videoUrl}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
            poster={fallbackImage}
          >
            <source src={videoUrl} />
          </video>
        ) : (
          <img
            src={fallbackImage}
            alt="Artist painting a mural"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/15 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundRepeat: 'repeat' }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-20 h-full container-x flex flex-col justify-center"
        style={{ opacity, y: titleY }}
      >
        <h1 className="font-serif text-paper text-display-xl max-w-6xl tracking-tight [text-shadow:0_4px_15px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.8)]">
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
            <span className="italic font-light text-gradient [text-shadow:none]">
              {t('hero.title_l3')}
            </span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-paper/90 text-base lg:text-lg leading-relaxed [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
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
            className="btn-primary group"
          >
            {t('hero.cta_primary')}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-paper/10 text-paper border border-paper/30 text-sm font-medium tracking-wide hover:bg-paper/20 hover:border-mint transition-all backdrop-blur-sm"
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
          <span className="tracking-[0.18em]  opacity-80"></span>
          <a href="#about" className="group flex items-center gap-2 hover:gap-3 transition-all">
            <span className="tracking-[0.18em] uppercase opacity-80">{t('hero.scroll')}</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </motion.div>

      {/* Tri-color accent bar — the brand's signature stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 z-30 flex">
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-violet" />
        <div className="flex-1 bg-magenta" />
      </div>
    </section>
  )
}
