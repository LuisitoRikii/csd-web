import { useMemo, useState, useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'
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
    <figure
      ref={wrapRef}
      className="group relative overflow-hidden rounded-lg bg-ink aspect-[4/5]"
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

      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/15" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-paper text-ink flex items-center justify-center hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {playing ? (
          <Pause size={16} className="fill-current" aria-hidden="true" />
        ) : (
          <Play size={16} className="ml-0.5 fill-current" aria-hidden="true" />
        )}
      </button>

      <figcaption className="absolute bottom-4 left-4 right-4 text-paper">
        <p className="text-sm font-medium tracking-tight leading-tight">
          {title}
        </p>
      </figcaption>
    </figure>
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
    <section id="videos" className="relative py-16 lg:py-24 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10 items-end">
          <div className="lg:col-span-7">

            <h2 className="mt-4 font-serif text-display-md tracking-tight text-ink text-balance">
              {t('videos.title_l1')}
              <br />
              <span className="italic font-light text-charcoal">{t('videos.title_l2')}</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-steel text-base lg:text-lg leading-relaxed">
              {t('videos.subtitle')}
            </p>
          </div>
        </div>

        {list.length > 0 ? (
          <>
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

            <div className="hidden md:grid grid-cols-3 gap-5">
              {list.map((video) => (
                <VideoCard key={video.id || video.src} video={video} isEs={isEs} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-line bg-paper px-8 py-14 text-center">
            <VideoIcon size={28} className="text-steel mx-auto mb-4" aria-hidden="true" />
            <p className="text-sm text-steel">
              {isEs
                ? 'Marque proyectos como “Work in Motion” desde el panel para verlos aquí.'
                : 'Mark projects as “Work in Motion” from the admin to see them here.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}