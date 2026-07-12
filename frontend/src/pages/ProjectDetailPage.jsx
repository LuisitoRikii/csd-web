import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, MapPin, Clock, User, Calendar, Tag, Expand, Share2 } from 'lucide-react'
import { projectService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { APP_BASE_URL } from '@/config'
import { CTA } from '@/components/sections/CTA'
import toast from 'react-hot-toast'

export const ProjectDetailPage = () => {
  const { slug } = useParams()
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [lightbox, setLightbox] = useState({ open: false, slides: [], index: 0 })

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectService.get(slug),
    enabled: !!slug,
  })
  const { data: related = [] } = useQuery({
    queryKey: ['related-projects', slug],
    queryFn: () => projectService.list({ limit: 4 }),
  })

  if (isLoading) return <div className="pt-40 pb-32 text-center">{t('common.loading')}</div>
  if (!project) return (
    <div className="pt-40 pb-32 text-center">
      <p>{t('common.error')}</p>
      <Link to="/portfolio" className="text-cyan mt-4 inline-block">{t('blog_page.back')}</Link>
    </div>
  )

  const title = lang === 'es' ? project.title_es : project.title_en
  const desc = lang === 'es' ? project.long_description_es || project.description_es : project.long_description_en || project.description_en
  const relatedFiltered = related.filter((p) => p.slug !== project.slug).slice(0, 3)

  const allImages = project.images?.length
    ? project.images.map((i) => ({ src: i.image_url }))
    : [{ src: project.cover_image }]

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url)
      toast.success('Link copied')
    }
  }

  return (
    <>
      <Helmet>
        <title>{title} | CSD Good Services</title>
        <meta name="description" content={desc?.slice(0, 160)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc?.slice(0, 160)} />
        {project.cover_image && <meta property="og:image" content={project.cover_image} />}
        <link rel="canonical" href={`${APP_BASE_URL}/portfolio/${project.slug}`} />
      </Helmet>

      <article className="pt-32">
        <div className="container-x mb-12">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            {t('blog_page.back')}
          </Link>
        </div>

        <header className="container-x mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display-lg tracking-tight max-w-4xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-charcoal max-w-3xl leading-relaxed"
          >
            {project.description_en}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {project.location && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-sm">
                <MapPin size={14} className="text-magenta" />
                {project.location}
              </span>
            )}
            {project.client && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-sm">
                <User size={14} className="text-violet" />
                {project.client}
              </span>
            )}
            {project.duration && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-sm">
                <Clock size={14} className="text-cyan" />
                {project.duration}
              </span>
            )}
            {project.year && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-sm">
                <Calendar size={14} className="text-orange-500" />
                {project.year}
              </span>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper border border-line text-sm hover:border-ink/30 transition-colors"
            >
              <Share2 size={14} />
              {t('common.share')}
            </button>
          </motion.div>
        </header>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative aspect-[16/8] lg:aspect-[16/7] overflow-hidden bg-ink"
        >
          <img
            src={project.cover_image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Description */}
        <section className="py-24 bg-canvas">
          <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <h2 className="font-serif text-display-md tracking-tight">
                  The <span className="italic font-light">story</span>
                </h2>
                {project.services_used && (
                  <div className="mt-6">
                    <p className="text-xs text-steel uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Tag size={12} /> Services
                    </p>
                    <p className="text-sm text-charcoal">{project.services_used}</p>
                  </div>
                )}
                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-all"
                >
                  {t('hero.cta_primary')}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-8">
              <p className="text-xl lg:text-2xl font-serif leading-relaxed text-charcoal">
                {desc}
              </p>

              {project.before_image && project.after_image && (
                <div className="mt-16">
                  <h3 className="font-serif text-3xl tracking-tight mb-6">
                    Before <span className="italic font-light">/ After</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <figure className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream">
                      <img src={project.before_image} alt="Before" className="w-full h-full object-cover" />
                      <figcaption className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-paper text-ink text-xs font-medium">
                        {t('portfolio.before')}
                      </figcaption>
                    </figure>
                    <figure className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream">
                      <img src={project.after_image} alt="After" className="w-full h-full object-cover" />
                      <figcaption className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-paper text-ink text-xs font-medium">
                        {t('portfolio.after')}
                      </figcaption>
                    </figure>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {project.images?.length > 0 && (
          <section className="py-16 bg-cream">
            <div className="container-x mb-10">
              <h2 className="font-serif text-display-md tracking-tight">
                Visual <span className="italic font-light">details</span>
              </h2>
            </div>
            <div className="container-x grid grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightbox({ open: true, slides: allImages, index: i })}
                  className={`relative overflow-hidden rounded-2xl bg-paper group ${
                    i === 0 ? 'lg:col-span-2 lg:row-span-2 aspect-[4/3]' : 'aspect-[4/3]'
                  }`}
                  data-cursor="image"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-paper/90 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand size={14} />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {relatedFiltered.length > 0 && (
          <section className="py-24 bg-canvas">
            <div className="container-x">
              <h3 className="font-serif text-display-md tracking-tight mb-10">
                {lang === 'es' ? 'Otros proyectos' : 'More projects'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedFiltered.map((p) => (
                  <Link
                    key={p.id}
                    to={`/portfolio/${p.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream mb-4">
                      <img
                        src={p.cover_image}
                        alt={lang === 'es' ? p.title_es : p.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h4 className="font-serif text-xl tracking-tight group-hover:text-cyan transition-colors">
                      {lang === 'es' ? p.title_es : p.title_en}
                    </h4>
                    <span className="text-xs text-steel uppercase tracking-wider mt-2 inline-block">
                      {p.location}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTA />
      </article>

      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ ...lightbox, open: false })}
        slides={lightbox.slides}
        index={lightbox.index}
      />
    </>
  )
}
