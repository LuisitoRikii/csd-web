import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Play, Pause, Video as VideoIcon } from 'lucide-react'
import { projectService } from '@/services'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const VideoCard = ({ video, isEs }) => {
  const wrapRef = useRef(null)
  const vidRef = useRef(null)
  const reduced = useReducedMotion()
  const inView = useInView(wrapRef, { amount: 0.4 })
  const [playing, setPlaying] = useState(false)
  const [errored, setErrored] = useState(false)

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

  const toggle = (event) => {
    event.stopPropagation()
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

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-home-videos'],
    queryFn: () => projectService.list({ home_videos: true, limit: 24 }),
  })

  const list = useMemo(
    () => projects
      .filter((project) => project.video_url)
      .map((project) => ({
        id: project.id,
        slug: project.slug,
        label_en: project.title_en,
        label_es: project.title_es,
        poster: project.cover_image,
        src: project.video_url,
      })),
    [projects]
  )

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
          <>
            {/* Mobile carousel */}
            <div className="md:hidden">
              <Swiper
                modules={[Pagination]}
                spaceBetween={16}
                slidesPerView={1.15}
                centeredSlides
                pagination={{ clickable: true }}
                className="!pb-12"
              >
                {list.map((video) => (
                  <SwiperSlide key={video.id || video.src} className="!h-auto">
                    <VideoCard video={video} isEs={isEs} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 gap-5">
              {list.map((video) => (
                <VideoCard key={video.id || video.src} video={video} isEs={isEs} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-line bg-paper px-8 py-16 text-center">
            <VideoIcon size={32} className="text-steel mx-auto mb-4" aria-hidden="true" />
            <p className="text-sm text-charcoal/80">
              {isEs
                ? 'Marca proyectos como “Work in Motion” desde el panel para verlos aquí.'
                : 'Mark projects as “Work in Motion” from the admin to see them here.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}