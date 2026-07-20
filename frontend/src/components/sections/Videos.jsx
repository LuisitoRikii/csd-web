import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Play, Pause, Video as VideoIcon } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const VideoCard = ({ video, isEs }) => {
  const wrapRef = useRef(null)
  const vidRef = useRef(null)
  const reduced = useReducedMotion()
  const inView = useInView(wrapRef, { amount: 0.4 })
  const [playing, setPlaying] = useState(false)
  const [errored, setErrored] = useState(false)

  // Autoplay when scrolled into view; pause when out. Respect reduced-motion
  // (don't auto-play video if the user prefers no motion — show poster only).
  useEffect(() => {
    const v = vidRef.current
    if (!v || errored) return
    if (reduced) {
      v.pause()
      v.currentTime = 0
      setPlaying(false)
      return
    }
    if (inView) {
      v.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [inView, errored, reduced])

  const toggle = (e) => {
    e.stopPropagation()
    const v = vidRef.current
    if (!v) return
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const title = isEs ? video.label_es : video.label_en

  return (
    <motion.figure
      ref={wrapRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-ink aspect-[4/5]"
    >
      {!errored ? (
        <video
          ref={vidRef}
          poster={video.poster}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={() => setErrored(true)}
        >
          <source src={video.src} />
        </video>
      ) : (
        <img
          src={video.poster}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-ink/20" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-paper/95 backdrop-blur-sm text-ink flex items-center justify-center shadow-lift hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {playing ? (
          <Pause size={20} className="fill-current" aria-hidden="true" />
        ) : (
          <Play size={20} className="ml-1 fill-current" aria-hidden="true" />
        )}
      </button>

      <figcaption className="absolute bottom-5 left-5 right-5 text-paper">
        <p className="text-sm lg:text-base font-medium tracking-tight leading-tight">
          {title}
        </p>
      </figcaption>
    </motion.figure>
  )
}

export const Videos = () => {
  const { t, i18n } = useTranslation()
  const isEs = i18n.language === 'es'
  const { videos } = useSiteSettings()
  const list = videos.list || []

  return (
    <section id="videos" className="relative py-24 lg:py-36 bg-subtle">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 items-end">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-serif text-display-lg tracking-tight text-ink text-balance"
            >
              {t('videos.title_l1')}
              <br />
              <span className="italic font-light text-charcoal">{t('videos.title_l2')}</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-charcoal/80 text-lg leading-relaxed"
            >
              {t('videos.subtitle')}
            </motion.p>
          </div>
        </div>

        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {list.map((v) => (
              <VideoCard key={v.id || v.src} video={v} isEs={isEs} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-line bg-paper px-8 py-16 text-center">
            <VideoIcon size={32} className="text-steel mx-auto mb-4" aria-hidden="true" />
            <p className="text-sm text-charcoal/80">
              {isEs
                ? 'Pronto vamos a cargar videos desde el admin.'
                : 'Work videos coming soon — add entries from the admin.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
