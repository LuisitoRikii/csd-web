import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import { ArrowUpRight, ImageIcon } from 'lucide-react'
import { projectService } from '@/services'
import { FadeUp } from '@/components/ui/Reveal'

const tagLabel = (tag, t) => {
  if (!tag) return ''
  return t(`beforeafter.${tag}`, tag)
}

export const BeforeAfter = () => {
  const { t, i18n } = useTranslation()
  const isEs = i18n.language === 'es'

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-home-before-after'],
    queryFn: () => projectService.list({ home_before_after: true, limit: 24 }),
  })

  const pairs = useMemo(
    () => projects
      .filter((project) => project.before_image && project.after_image)
      .map((project) => ({
        id: project.id,
        slug: project.slug,
        key: project.home_before_after_tag || project.slug,
        tag: project.home_before_after_tag || '',
        title_en: project.title_en,
        title_es: project.title_es,
        before: project.before_image,
        after: project.after_image,
        scope_en: project.long_description_en || project.description_en,
        scope_es: project.long_description_es || project.description_es,
      })),
    [projects]
  )

  const tagKeys = useMemo(() => {
    const seen = new Set()
    pairs.forEach((pair) => pair.tag && seen.add(pair.tag))
    return Array.from(seen)
  }, [pairs])

  const tags = [
    { id: 'all', label: t('beforeafter.tag_all') },
    ...tagKeys.map((tag) => ({ id: tag, label: tagLabel(tag, t) })),
  ]
  const [active, setActive] = useState('all')

  const filtered = useMemo(() => {
    if (active === 'all') return pairs
    return pairs.filter((pair) => pair.key === active)
  }, [pairs, active])

  return (
    <section className="relative py-16 lg:py-24 bg-ink text-paper border-t border-line">
      <div className="container-x">
        <FadeUp className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10 items-end">
          <div className="lg:col-span-7">
            <h2 className="mt-4 font-serif text-display-md tracking-tight text-paper text-balance">
              {t('beforeafter.title_l1')}
              <br />
              <span className="italic font-light text-paper/70">
                {t('beforeafter.title_l2')}
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-paper/70 text-base lg:text-lg leading-relaxed">
              {t('beforeafter.subtitle')}
            </p>
          </div>
        </FadeUp>

        {pairs.length > 0 ? (
          <>
            {tags.length > 1 && (
              <FadeUp delay={0.1} className="mb-8 flex flex-wrap items-center gap-2">
                {tags.map((tag) => {
                  const isActive = active === tag.id
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setActive(tag.id)}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.16em] transition-colors border ${
                        isActive
                          ? 'bg-paper text-ink border-paper'
                          : 'bg-transparent text-paper/70 border-paper/20 hover:border-paper/50 hover:text-paper'
                      }`}
                    >
                      {tag.label}
                    </button>
                  )
                })}
              </FadeUp>
            )}

            <FadeUp y={16} delay={0.15}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 7000, disableOnInteraction: false }}
              loop={filtered.length > 1}
              noSwipingClass="swiper-no-swiping"
              noSwipingSelector=".swiper-no-swiping"
              preventInteractionOnTransition
              className="!pb-12"
              style={{
                '--swiper-navigation-color': '#FFFFFF',
                '--swiper-navigation-size': '22px',
                '--swiper-pagination-color': '#FFFFFF',
                '--swiper-pagination-bullet-inactive-color': '#FFFFFF50',
              }}
            >
              {filtered.map((pair) => (
                <SwiperSlide key={pair.id || pair.slug}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                    <div className="lg:col-span-8">
                      <BeforeAfterSlider
                        before={pair.before}
                        after={pair.after}
                        beforeLabel={t('beforeafter.before')}
                        afterLabel={t('beforeafter.after')}
                      />
                    </div>
                    <div className="lg:col-span-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-paper/60 mb-3 font-medium">
                        {tagLabel(pair.tag, t) || pair.tag}
                      </p>
                      <h3 className="font-serif text-2xl lg:text-3xl text-paper tracking-tight text-balance">
                        {isEs ? pair.title_es : pair.title_en}
                      </h3>
                      {(isEs ? pair.scope_es : pair.scope_en) && (
                        <p className="mt-4 text-paper/70 leading-relaxed">
                          {isEs ? pair.scope_es : pair.scope_en}
                        </p>
                      )}
                      {pair.slug && (
                        <a
                          href={`/portfolio/${pair.slug}`}
                          className="mt-6 inline-flex items-center gap-2 text-sm text-paper link-underline"
                        >
                          {isEs ? 'Ver proyecto completo' : 'See full project'} <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            </FadeUp>
          </>
        ) : (
          <div className="rounded-lg border border-paper/10 px-8 py-14 text-center">
            <ImageIcon size={28} className="text-paper/40 mx-auto mb-4" aria-hidden="true" />
            <p className="text-paper/70 text-sm">
              {isEs
                ? 'Marque proyectos con imágenes antes/después desde el panel para verlos aquí.'
                : 'Mark projects with before/after images from the admin to see them here.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}