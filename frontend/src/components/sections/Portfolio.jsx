import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Expand } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { projectService, categoryService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { FadeUp, FadeStagger, FadeStaggerItem } from '@/components/ui/Reveal'

const ProjectSlide = ({ project, lang, onImageClick }) => {
  const title = lang === 'es' ? project.title_es : project.title_en

  return (
    <Link to={`/portfolio/${project.slug}`} className="block group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer bg-muted">
        <img
          src={project.cover_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-0 p-4 flex flex-col justify-end text-paper translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-smooth">
          <h3 className="font-serif text-lg leading-tight tracking-tight drop-shadow">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-paper/85">
            <span className="uppercase tracking-wider">{project.services_used || project.year}</span>
            <span className="font-mono">{project.year}</span>
          </div>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onImageClick(project) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper/90 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-paper"
          aria-label="Expand"
        >
          <Expand size={12} />
        </button>
      </div>
    </Link>
  )
}

const FilterPill = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-medium tracking-[0.06em] uppercase transition-colors border ${
      active
        ? 'bg-ink text-paper border-ink'
        : 'bg-paper text-ink border-line hover:border-ink/40'
    }`}
  >
    {label}
  </button>
)

export const Portfolio = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightbox, setLightbox] = useState({ open: false, slides: [], index: 0 })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.list(),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  })

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return projects
    return projects.filter((p) => p.category?.slug === activeFilter)
  }, [projects, activeFilter])

  const openLightbox = (project) => {
    const imgs = project.images?.length ? project.images.map((i) => ({ src: i.image_url, alt: project.title_en })) : [{ src: project.cover_image, alt: project.title_en }]
    setLightbox({ open: true, slides: imgs, index: 0 })
  }

  return (
    <section id="portfolio" className="relative py-16 lg:py-24 bg-canvas border-t border-line">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <FadeUp className="max-w-2xl">
            <h2 className="mt-4 font-serif text-display-md tracking-tight text-ink text-balance">
              {t('portfolio.title_l1')}
              <br />
              <span className="italic font-light text-charcoal">{t('portfolio.title_l2')}</span>
            </h2>
            <p className="mt-4 text-steel max-w-lg text-base lg:text-lg leading-relaxed">
              {t('portfolio.subtitle')}
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <Link to="/portfolio" className="hidden lg:inline-flex items-center gap-2 text-sm text-ink link-underline">
              {t('portfolio.view_all')}
              <ArrowUpRight size={14} />
            </Link>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="flex flex-wrap items-center gap-2 mb-8">
          <FilterPill
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            label={t('portfolio.filter_all')}
          />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              active={activeFilter === c.slug}
              onClick={() => setActiveFilter(c.slug)}
              label={lang === 'es' ? c.name_es : c.name_en}
            />
          ))}
        </FadeUp>

        <div className="lg:hidden">
          <FadeUp y={16} delay={0.15}>
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1.15}
              centeredSlides
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2.15, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
              className="!pb-12"
            >
              {filtered.map((project) => (
                <SwiperSlide key={project.id} className="!h-auto">
                  <ProjectSlide project={project} lang={lang} onImageClick={openLightbox} />
                </SwiperSlide>
              ))}
            </Swiper>
          </FadeUp>
        </div>

        <FadeStagger className="hidden lg:block columns-3 xl:columns-4 gap-5" staggerDelay={0.06}>
          {filtered.map((p, i) => {
            const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[5/7]']
            const aspect = heights[i % heights.length]
            return (
              <FadeStaggerItem key={p.id} y={16} className="mb-5 break-inside-avoid">
                <div className={`relative ${aspect} group overflow-hidden rounded-lg cursor-pointer bg-muted`}>
                  <Link to={`/portfolio/${p.slug}`}>
                    <img
                      src={p.cover_image}
                      alt={lang === 'es' ? p.title_es : p.title_en}
                      className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-paper translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-smooth">
                      <h3 className="font-serif text-lg leading-tight tracking-tight">
                        {lang === 'es' ? p.title_es : p.title_en}
                      </h3>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-paper/85">
                        <span className="uppercase tracking-wider">{p.services_used || p.year}</span>
                        <span className="font-mono">{p.year}</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => openLightbox(p)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper/90 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-paper"
                    aria-label="Expand"
                  >
                    <Expand size={12} />
                  </button>
                </div>
              </FadeStaggerItem>
            )
          })}
        </FadeStagger>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-steel">{t('portfolio.no_projects')}</div>
        )}

        <FadeUp delay={0.15} className="mt-10 flex justify-center lg:hidden">
          <Link to="/portfolio" className="btn-primary">
            {t('portfolio.view_all')}
          </Link>
        </FadeUp>
      </div>

      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ ...lightbox, open: false })}
        slides={lightbox.slides}
        index={lightbox.index}
        styles={{ container: { backgroundColor: 'rgba(11,11,18,0.95)' } }}
      />
    </section>
  )
}