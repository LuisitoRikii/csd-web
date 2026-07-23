import { useState } from 'react'
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
    <section id="services" className="relative py-16 lg:py-20 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="max-w-2xl mb-10">
          <h2 className="mt-4 font-serif text-display-md tracking-tight text-ink text-balance">
            {t('services.title_l1')}
            <br />
            <span className="italic font-light text-charcoal">{t('services.title_l2')}</span>
          </h2>
          <p className="mt-4 text-steel text-base lg:text-lg max-w-xl leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>
      </div>

      <div className="pl-5 md:pl-10 lg:pl-16">
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
          {services.slice(0, 8).map((s) => {
            const title = isEs ? s.title_es : s.title_en
            const desc = isEs ? s.description_es : s.description_en
            const img = s.image_url || s.cover_image
            const galleryCount = (s.projects || []).length
            const hasGallery = galleryCount > 0

            return (
              <SwiperSlide key={s.id || s.slug || title} className="!h-auto">
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
                    className="block w-full text-left aspect-[4/3] rounded-lg overflow-hidden bg-muted relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-steel text-xs uppercase tracking-[0.18em]">
                        {title}
                      </div>
                    )}

                    {hasGallery && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paper text-ink text-[10px] uppercase tracking-[0.16em] font-medium">
                        <Images size={10} aria-hidden="true" />
                        {galleryCount}
                      </span>
                    )}
                  </button>

                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="font-serif text-lg tracking-tight text-ink leading-snug">
                      {title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-steel line-clamp-2">
                      {desc}
                    </p>

                    {hasGallery ? (
                      <button
                        type="button"
                        onClick={() => setActiveService(s)}
                        className="mt-4 link-underline text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-ink w-fit"
                      >
                        {t('services.view_gallery')}
                      </button>
                    ) : (
                      <Link
                        to="/contact"
                        className="mt-4 link-underline text-xs uppercase tracking-[0.16em] text-ink/70 hover:text-ink w-fit"
                      >
                        {t('services.cta_quote')}
                      </Link>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <div className="container-x mt-10 flex justify-center">
        <Link to="/services" className="btn-primary">
          {t('services.view_all')}
        </Link>
      </div>

      <ServiceGalleryModal
        service={activeService}
        open={!!activeService}
        onClose={() => setActiveService(null)}
      />
    </section>
  )
}