import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
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

const ProjectSlide = ({ project, lang, onImageClick }) => {
  const title = lang === 'es' ? project.title_es : project.title_en

  return (
    <Link to={`/portfolio/${project.slug}`} className="block group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer bg-subtle">
        <img
          src={project.cover_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-smooth group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="px-3 py-1.5 rounded-full bg-paper/90 text-ink text-[10px] tracking-[0.2em] uppercase">
              {project.location || 'Miami, FL'}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onImageClick(project) }}
              className="w-9 h-9 rounded-full bg-paper/90 text-ink flex items-center justify-center hover:bg-paper transition-colors"
              aria-label="Expand"
            >
              <Expand size={14} />
            </button>
          </div>

          <div className="text-paper translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-smooth">
            <h3 className="font-serif text-xl lg:text-2xl leading-tight tracking-tight">
              {title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs text-paper/80">
              <span className="uppercase tracking-wider">{project.services_used || project.year}</span>
              <span className="font-mono">{project.year}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

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
    <section id="portfolio" className="relative py-32 lg:py-48 bg-canvas">
      <div className="container-x relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-display-lg tracking-tight"
            >
              {t('portfolio.title_l1')}
              <br />
              <span className="italic font-light">{t('portfolio.title_l2')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-charcoal/80 max-w-lg"
            >
              {t('portfolio.subtitle')}
            </motion.p>
          </div>

          <Link
            to="/portfolio"
            className="hidden lg:inline-flex items-center gap-2 text-sm tracking-wide hover:text-violet transition-colors group"
          >
            View all
            <span className="inline-flex w-7 h-7 rounded-full items-center justify-center bg-gradient-spectrum text-paper transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={12} />
            </span>
          </Link>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
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
              color={c.color}
            />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="lg:hidden">
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
        </div>

        {/* Desktop masonry */}
        <div className="hidden lg:block columns-3 xl:columns-4 gap-5">
          {filtered.map((p, i) => {
            const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[5/7]']
            const aspect = heights[i % heights.length]
            return (
              <div key={p.id} className="mb-5 break-inside-avoid">
                <ProjectSlideCard project={p} idx={i} lang={lang} onImageClick={openLightbox} aspect={aspect} />
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-charcoal/60">{t('portfolio.no_projects')}</div>
        )}
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

const ProjectSlideCard = ({ project, idx, lang, onImageClick, aspect }) => {
  const title = lang === 'es' ? project.title_es : project.title_en
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: (idx % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${aspect} group overflow-hidden rounded-2xl cursor-pointer bg-subtle`}
      data-cursor="image"
    >
      <Link to={`/portfolio/${project.slug}`}>
        <img
          src={project.cover_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-smooth group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="px-3 py-1.5 rounded-full bg-paper/90 text-ink text-[10px] tracking-[0.2em] uppercase">
              {project.location || 'Miami, FL'}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); onImageClick(project) }}
              className="w-9 h-9 rounded-full bg-paper/90 text-ink flex items-center justify-center hover:bg-paper transition-colors"
              aria-label="Expand"
            >
              <Expand size={14} />
            </button>
          </div>
          <div className="text-paper translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-smooth">
            <h3 className="font-serif text-xl lg:text-2xl leading-tight tracking-tight">{title}</h3>
            <div className="flex items-center justify-between mt-2 text-xs text-paper/80">
              <span className="uppercase tracking-wider">{project.services_used || project.year}</span>
              <span className="font-mono">{project.year}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const FilterPill = ({ active, onClick, label, color }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-[0.05em] uppercase transition-all duration-300 border ${
      active
        ? 'bg-ink text-paper border-ink'
        : 'bg-paper text-ink border-line hover:border-ink/40'
    }`}
    style={active && color ? { background: color, borderColor: color } : undefined}
  >
    {label}
  </button>
)