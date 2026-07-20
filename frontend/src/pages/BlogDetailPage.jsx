import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Calendar, Clock, User, ArrowRight, Share2 } from 'lucide-react'
import { blogService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDate } from '@/utils/cn'
import { CTA } from '@/components/sections/CTA'
import { SEO, buildBreadcrumbSchema } from '@/components/ui/SEO'
import toast from 'react-hot-toast'

const proseClass =
  'prose prose-lg max-w-none ' +
  'prose-headings:font-serif prose-headings:tracking-tight ' +
  'prose-h2:font-serif prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 ' +
  'prose-p:text-charcoal prose-p:leading-relaxed'

export const BlogDetailPage = () => {
  const { slug } = useParams()
  const { t } = useTranslation()
  const { lang } = useLanguage()

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.get(slug),
    enabled: !!slug,
  })
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-list'],
    queryFn: () => blogService.list({ published_only: true, limit: 6 }),
  })

  if (isLoading) return <div className="pt-40 pb-32 text-center">{t('common.loading')}</div>
  if (!post) return (
    <div className="pt-40 pb-32 text-center">
      <Link to="/blog" className="text-brand">{t('blog_page.back')}</Link>
    </div>
  )

  const title = lang === 'es' ? post.title_es : post.title_en
  const content = lang === 'es' ? post.content_es : post.content_en
  const related = posts.filter((p) => p.id !== post.id).slice(0, 3)

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url)
      toast.success(t('blog_page.share_copied'))
    }
  }

  return (
    <>
      <SEO
        title={`${title} | CSD Good Services`}
        description={lang === 'es' ? post.excerpt_es : post.excerpt_en}
        path={`/blog/${slug}`}
        image={post.cover_image || undefined}
        type="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: lang === 'es' ? post.excerpt_es : post.excerpt_en,
          image: post.cover_image,
          datePublished: post.published_at,
          author: { '@type': 'Organization', name: 'CSD Good Services' },
          publisher: { '@type': 'Organization', name: 'CSD Good Services' },
          inLanguage: lang,
          ...buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: title, path: `/blog/${slug}` },
          ]),
        }}
      />

      <article className="pt-32">
        <div className="container-x max-w-4xl mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink">
            <ArrowLeft size={14} />
            {t('blog_page.back')}
          </Link>
        </div>

        <header className="container-x max-w-4xl mb-12">
          <div className="flex items-center gap-4 text-xs text-steel uppercase tracking-wider mb-5">
            {post.category && (
              <span className="px-3 py-1 rounded-full bg-subtle capitalize">{post.category}</span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> {formatDate(post.published_at, lang)}
              </span>
            )}
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {post.read_time} {t('blog_page.read_time')}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User size={12} /> {post.author}
              </span>
            )}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-display-lg tracking-tight"
          >
            {title}
          </motion.h1>
          <p className="mt-6 text-xl text-charcoal/80 leading-relaxed font-serif">
            {lang === 'es' ? post.excerpt_es : post.excerpt_en}
          </p>
          <button
            onClick={handleShare}
            className="mt-6 inline-flex items-center gap-2 text-sm text-steel hover:text-ink transition-colors"
          >
            <Share2 size={14} />
            {t('common.share')}
          </button>
        </header>

        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container-x max-w-5xl mb-16"
          >
            <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-subtle">
              <img src={post.cover_image} alt={title} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}

        <div className="container-x max-w-3xl">
          {content && (
            <article
              className={proseClass}
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
            />
          )}

          {post.tags && (
            <div className="mt-12 pt-8 border-t border-line flex flex-wrap gap-2">
              {post.tags.split(',').map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-subtle text-xs">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-32 py-20 bg-subtle">
            <div className="container-x">
              <h3 className="font-serif text-display-sm tracking-tight mb-10">
                {t('blog_page.keep_reading')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group bg-paper rounded-3xl overflow-hidden border border-line hover:shadow-soft transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={p.cover_image}
                        alt={lang === 'es' ? p.title_es : p.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      {p.category && (
                        <span className="text-xs text-steel uppercase tracking-wider mb-2 inline-block">
                          {p.category}
                        </span>
                      )}
                      <h4 className="font-serif text-xl tracking-tight mb-2 group-hover:text-brand transition-colors">
                        {lang === 'es' ? p.title_es : p.title_en}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs text-steel group-hover:text-ink transition-colors">
                        {t('blog_page.read_more')}
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="container-x max-w-3xl mt-16 pt-16 border-t border-line">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink">
            <ArrowLeft size={14} />
            {t('blog_page.back')}
          </Link>
        </div>
      </article>

      <div className="mt-24">
        <CTA />
      </div>
    </>
  )
}
