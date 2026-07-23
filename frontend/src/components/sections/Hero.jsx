import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

// These fallbacks are sourced from the backend `media` settings (hero_*_fallback_url).
// They are used only when the admin hasn't uploaded custom media yet.
const HERO_FALLBACK_IMG = '/xddd.webp'

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
<<<<<<< HEAD
  // Parallax sutil, sin el scale/zoom dramático de la versión anterior
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
=======
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
>>>>>>> e84f01605bf8ffc99fc4ebd254c024081130ed3f
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
    <section
      ref={ref}
      className="relative h-[78vh] min-h-[600px] w-full overflow-hidden bg-ink"
    >
<<<<<<< HEAD
      {/* Background media — overlay simple y uniforme, sin grano ni recorte curvo */}
=======
      {/* Background media */}
>>>>>>> e84f01605bf8ffc99fc4ebd254c024081130ed3f
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
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
            alt="Equipo trabajando en un proyecto de pintura"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
<<<<<<< HEAD
        className="relative z-20 h-full container-x flex flex-col justify-center mt-16"
        style={{ opacity }}
      >

        <h1 className="font-serif text-paper text-display-lg max-w-4xl tracking-tight">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.title_l1')}
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {t('hero.title_l2')} {t('hero.title_l3')}
          </motion.span>
        </h1>
=======
        className="relative z-20 h-full container-x flex flex-col justify-center"
        style={{ opacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-paper text-display-lg max-w-3xl tracking-tight leading-[1.1] text-balance"
        >
          {t('hero.title_l1')} {t('hero.title_l2')}{' '}
          <span className="italic font-light text-paper/85">{t('hero.title_l3')}</span>
        </motion.h1>
>>>>>>> e84f01605bf8ffc99fc4ebd254c024081130ed3f

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-lg text-paper/75 font-sans text-base lg:text-lg leading-relaxed"
=======
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-paper/75 text-base lg:text-lg leading-relaxed"
>>>>>>> e84f01605bf8ffc99fc4ebd254c024081130ed3f
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA row — un botón primario claro, uno secundario de texto. Sin blur ni bordes decorativos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
          transition={{ duration: 0.6, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-6 mt-10"
        >
          <Link to="/contact" className="btn-primary group">
            {t('hero.cta_primary')}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
=======
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-3 mt-10"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-ink text-sm font-medium hover:bg-white/90 transition-all"
          >
            {t('hero.cta_primary')} <ArrowUpRight size={14} />
>>>>>>> e84f01605bf8ffc99fc4ebd254c024081130ed3f
          </Link>
          <Link
            to="/portfolio"
<<<<<<< HEAD
            className="group inline-flex items-center gap-2 text-paper font-sans text-sm font-medium tracking-wide border-b border-paper/30 pb-0.5 hover:border-paper transition-colors"
=======
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-paper/25 text-paper text-sm font-medium hover:bg-paper hover:text-ink hover:border-paper transition-all"
>>>>>>> e84f01605bf8ffc99fc4ebd254c024081130ed3f
          >
            {t('hero.cta_secondary')}
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}