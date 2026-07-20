import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { Images } from 'lucide-react'
import { ServiceGalleryModal } from '@/components/ui/ServiceGalleryModal'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

export const Services = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const [activeService, setActiveService] = useState(null)

  const { data: services = [] } = useQuery({
    queryKey: ['services-home'],
    queryFn: () => serviceService.list(),
  })

  return (
    <section id="services" className="relative py-20 lg:py-28 bg-subtle">
      <div className="container-x">
        <div className="max-w-2xl mb-10 lg:mb-12">
          <motion.h2
            {...fade}
            className="font-serif text-display-md tracking-tight text-ink text-balance"
          >
            {t('services.title_l1')}
            <br />
            <span className="italic font-light text-charcoal">{t('services.title_l2')}</span>
          </motion.h2>
          <motion.p
            {...fade}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-charcoal/80 text-base lg:text-lg max-w-xl leading-relaxed"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>
      </div>

      <motion.div
        {...fade}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pl-5 md:pl-10 lg:pl-16"
      >
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={28}
          slidesPerView={1.3}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop
          breakpoints={{
            640:  { slidesPerView: 1.9, spaceBetween: 30 },
            900:  { slidesPerView: 2.5, spaceBetween: 32 },
            1200: { slidesPerView: 3.2, spaceBetween: 34 },
            1440: { slidesPerView: 3.8, spaceBetween: 36 },
          }}
          style={{
            '--swiper-navigation-color': '#0F1117',
            '--swiper-navigation-size': '18px',
            paddingRight: '5%',
            paddingBottom: '20px',
            paddingTop: '4px',
          }}
        >
          {services.slice(0, 8).map((s, i) => {
            const title = isEs ? s.title_es : s.title_en
            const desc = isEs ? s.description_es : s.description_en
            const img = s.image_url || s.cover_image
            const galleryCount = (s.projects || []).length
            const hasGallery = galleryCount > 0

            return (
              <SwiperSlide key={s.id || s.slug || title} className="!h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <div className="group relative flex h-full flex-col">
                    <button
                      type="button"
                      onClick={() => hasGallery && setActiveService(s)}
                      aria-label={
                        hasGallery
                          ? isEs
                            ? `Abrir galería de ${s.title_es}`
                            : `Open gallery for ${s.title_en}`
                          : title
                      }
                      className="block w-full text-left aspect-[4/3] rounded-2xl overflow-hidden bg-subtle relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-subtle"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-steel text-xs uppercase tracking-[0.18em]">
                          {title}
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-ink/0 to-ink/0 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

                      {hasGallery && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paper/95 backdrop-blur text-ink text-[10px] uppercase tracking-[0.16em] font-semibold">
                          <Images size={10} aria-hidden="true" />
                          {galleryCount}
                        </span>
                      )}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                        style={{ background: 'linear-gradient(95deg, #91F2D7 0%, #8A04F0 50%, #D925A9 100%)' }}
                      />
                    </button>

                    <div className="relative mt-5 h-[2px] w-full overflow-hidden bg-line/70 rounded-full">
                      <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out bg-gradient-spectrum" />
                    </div>

                    <div className="mt-4 flex flex-1 flex-col">
                      <h3 className="font-serif text-lg tracking-tight text-ink leading-tight transition-colors duration-300 group-hover:text-violet">
                        {title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-snug text-charcoal/75 line-clamp-2">
                        {desc}
                      </p>

                      {hasGallery ? (
                        <button
                          type="button"
                          onClick={() => setActiveService(s)}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink/60 hover:text-violet transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-subtle rounded-full w-fit"
                        >
                          {t('services.view_gallery')}
                          <span className="tabular-nums opacity-70">{galleryCount}</span>
                        </button>
                      ) : (
                        <Link
                          to="/contact"
                          className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink/60 hover:text-violet transition-colors w-fit"
                        >
                          {t('services.cta_quote')}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </motion.div>

      <motion.div
        {...fade}
        className="mt-10 text-center"
      >
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-all"
        >
          {t('services.view_all')}
        </Link>
      </motion.div>

      <ServiceGalleryModal
        service={activeService}
        open={!!activeService}
        onClose={() => setActiveService(null)}
      />
    </section>
  )
}
