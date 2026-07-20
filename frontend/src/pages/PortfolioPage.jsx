import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Expand } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { projectService, categoryService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { SEO, buildBreadcrumbSchema } from '@/components/ui/SEO'

export const PortfolioPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightbox, setLightbox] = useState({ open: false, slides: [], index: 0 })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectService.list({ published_only: true }),
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
    const imgs = project.images?.length
      ? project.images.map((i) => ({ src: i.image_url, alt: project.title_en }))
      : [{ src: project.cover_image, alt: project.title_en }]
    setLightbox({ open: true, slides: imgs, index: 0 })
  }

  const title = lang === 'es' ? 'Portafolio | CSD Good Services' : 'Portfolio | CSD Good Services'
  const description = lang === 'es'
    ? 'Proyectos recientes de pintura, remodelación, epóxico y murales en Miami. Antes y después, cocinas, baños, fachadas y más.'
    : 'Recent painting, remodeling, epoxy and mural projects in Miami. Before and after, kitchens, bathrooms, facades and more.'

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/portfolio"
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
        ])}
      />

      <PageHero
        title={t('portfolio.title_l1')}
        accent={t('portfolio.title_l2')}
        subtitle={t('portfolio.subtitle')}
      />

      <section className="pb-32">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-2 mb-12 sticky top-20 bg-canvas/85 backdrop-blur-sm z-30 py-4 -mx-5 px-5">
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

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filtered.map((p, i) => {
              const title = lang === 'es' ? p.title_es : p.title_en
              const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[5/7]']
              const aspect = heights[i % heights.length]
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: (i % 6) * 0.05 }}
                  className={`mb-5 break-inside-avoid relative ${aspect} group overflow-hidden rounded-2xl bg-subtle`}
                  data-cursor="image"
                >
                  <Link to={`/portfolio/${p.slug}`}>
                    <img
                      src={p.cover_image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-smooth group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => { e.preventDefault(); openLightbox(p) }}
                          className="w-9 h-9 rounded-full bg-paper/90 text-ink flex items-center justify-center hover:bg-paper transition-colors"
                          aria-label="Expand"
                        >
                          <Expand size={14} />
                        </button>
                      </div>
                      <div className="text-paper">
                        <h3 className="font-serif text-2xl leading-tight tracking-tight">{title}</h3>
                        <div className="flex items-center justify-between mt-2 text-xs text-paper/80">
                          <span className="uppercase tracking-wider">{p.services_used || p.category?.name_en}</span>
                          <span className="font-mono">{p.year}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-32 text-charcoal/60 text-lg">{t('portfolio.no_projects')}</div>
          )}
        </div>
      </section>

      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ ...lightbox, open: false })}
        slides={lightbox.slides}
        index={lightbox.index}
        styles={{ container: { backgroundColor: 'rgba(11,11,18,0.95)' } }}
      />
    </>
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
    style={active && color ? { background: color, borderColor: color } : {}}
  >
    {label}
  </button>
)
