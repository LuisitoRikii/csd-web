import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, Calendar, Clock } from 'lucide-react'
import { blogService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDate } from '@/utils/cn'
import { APP_BASE_URL } from '@/config'
import { PageHero } from '@/components/ui/PageHero'

export const BlogPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog'],
    queryFn: () => blogService.list({ published_only: true }),
  })

  const featured = posts.find((p) => p.is_featured) || posts[0]
  const rest = posts.filter((p) => p.id !== featured?.id)

  return (
    <>
      <Helmet>
        <title>{lang === 'es' ? 'Diario | CSD' : 'Journal | CSD'}</title>
        <link rel="canonical" href={`${APP_BASE_URL}/blog`} />
      </Helmet>

      <PageHero
        title={t('blog_page.title')}
        subtitle={t('blog_page.subtitle')}
      />

      <section className="pb-32">
        <div className="container-x">
          {isLoading ? (
            <div className="text-center py-20 text-charcoal/60">{t('common.loading')}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 text-charcoal/60">{t('blog_page.no_posts')}</div>
          ) : (
            <>
              {featured && <FeaturedCard post={featured} lang={lang} />}

              <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {rest.map((p, i) => (
                  <BlogCard key={p.id} post={p} lang={lang} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

const FeaturedCard = ({ post, lang }) => {
  const t = useTranslation().t
  const title = lang === 'es' ? post.title_es : post.title_en
  const excerpt = lang === 'es' ? post.excerpt_es : post.excerpt_en

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 rounded-3xl bg-cream overflow-hidden border border-line/40"
    >
      <Link to={`/blog/${post.slug}`} className="block relative aspect-[4/3] lg:aspect-auto overflow-hidden">
        <img
          src={post.cover_image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-paper text-ink text-xs uppercase tracking-wider">
          Featured
        </span>
      </Link>
      <div className="p-8 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-4 text-xs text-steel uppercase tracking-wider mb-4">
          <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(post.published_at, lang)}</span>
          <span className="flex items-center gap-1.5"><Clock size={12} /> {post.read_time} {t('blog_page.read_time')}</span>
        </div>
        <h2 className="font-serif text-display-md tracking-tight mb-4">
          <Link to={`/blog/${post.slug}`} className="hover:text-cyan transition-colors">{title}</Link>
        </h2>
        <p className="text-charcoal/80 leading-relaxed mb-6">{excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-cyan transition-colors"
        >
          {t('blog_page.read_more')}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.article>
  )
}

const BlogCard = ({ post, lang, index }) => {
  const t = useTranslation().t
  const title = lang === 'es' ? post.title_es : post.title_en
  const excerpt = lang === 'es' ? post.excerpt_es : post.excerpt_en

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream mb-5">
          <img
            src={post.cover_image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-steel uppercase tracking-wider mb-3">
          <span className="px-2 py-0.5 rounded-full bg-cream">{post.category}</span>
          <span>{post.read_time} {t('blog_page.read_time')}</span>
        </div>
        <h3 className="font-serif text-2xl tracking-tight mb-2 group-hover:text-cyan transition-colors">
          {title}
        </h3>
        <p className="text-sm text-charcoal/80 line-clamp-3">{excerpt}</p>
      </Link>
    </motion.article>
  )
}
