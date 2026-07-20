import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

// These images stay in code because they are referenced by other components (About, etc.)
// as image fallbacks. They will be replaced by settings-driven URLs once those sections
// are wired up.
const HERO_FALLBACK_IMG = '/logo.png'
const HERO_POSTER = '/logo.png'

const HERO_VIDEO =
  'https://cdn.pixabay.com/video/2020/03/27/34125-399680914_large.mp4'

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
  hero: HERO_POSTER,
  heroAlt: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1920&q=80',
  modernHome: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
  kitchenNew: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
  kitchenOld: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
  bathroomNew: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
  bathroomOld: 'https://images.unsplash.com/photo-1556909190-3c0e6ad26c78?auto=format&fit=crop&w=1200&q=80',
  exteriorNew: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
  exteriorOld: 'https://images.unsplash.com/photo-1580587771525-78b9d27a32cc?auto=format&fit=crop&w=1200&q=80',
  livingNew: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
  livingOld: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  bedroomNew: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
  bedroomOld: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  facadeNew: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  facadeOld: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
  paintingInterior: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80',
  paintingExterior: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=80',
  epoxyFloor: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=80',
  epoxyCounter: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
  mural: 'https://images.unsplash.com/photo-1551355738-2c8a6df9e08a?auto=format&fit=crop&w=1600&q=80',
  drywall: 'https://images.unsplash.com/photo-1503387762-592deb58ef73?auto=format&fit=crop&w=1600&q=80',
  flooring: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=80',
  team: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
  tools: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
  worker1: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
  worker2: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1200&q=80',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  project1: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
  project2: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
  project3: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80',
  project4: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  project5: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  project6: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
  project7: 'https://images.unsplash.com/photo-1556909211-7b43e1d2b6e3?auto=format&fit=crop&w=1200&q=80',
  project8: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  project9: 'https://images.unsplash.com/photo-1551355738-2c8a6df9e08a?auto=format&fit=crop&w=1200&q=80',
  project10: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
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
  const videoUrl = raw && 'hero_video_url' in raw ? hero.videoUrl : HERO_VIDEO
  const fallbackImage = hero.imageUrl || hero.fallbackImage || HERO_FALLBACK_IMG

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
