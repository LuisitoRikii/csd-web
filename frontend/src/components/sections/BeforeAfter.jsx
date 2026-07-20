import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import { ArrowUpRight, ImageIcon } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export const BeforeAfter = () => {
  const { t, i18n } = useTranslation()
  const isEs = i18n.language === 'es'
  const { beforeAfter } = useSiteSettings()
  const pairs = beforeAfter.pairs || []

  const tagsFromData = useMemo(() => {
    const seen = new Set()
    pairs.forEach((p) => p.tag && seen.add(p.tag))
    return Array.from(seen)
  }, [pairs])

  const tags = [
    { id: 'all', label: t('beforeafter.tag_all') },
    ...tagsFromData.map((tag) => ({
      id: tag,
      label: t(`beforeafter.${tag}`, tag),
    })),
  ]
  const [active, setActive] = useState('all')

  const filtered = useMemo(() => {
    if (active === 'all') return pairs
    return pairs.filter((p) => p.key === active)
  }, [pairs, active])

  return (
    <section className="relative py-24 lg:py-36 bg-ink text-paper">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-end">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-display-lg tracking-tight text-paper text-balance"
            >
              {t('beforeafter.title_l1')}
              <br />
              <span className="italic font-light text-paper/70">{t('beforeafter.title_l2')}</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-paper/70 text-lg leading-relaxed"
            >
              {t('beforeafter.subtitle')}
            </motion.p>
          </div>
        </div>

        {pairs.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-10 flex flex-wrap items-center gap-2"
            >
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActive(tag.id)}
                  className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${
                    active === tag.id
                      ? 'text-paper border-transparent'
                      : 'bg-transparent text-paper/70 border-paper/20 hover:border-paper/50 hover:text-paper'
                  }`}
                  style={active === tag.id ? { backgroundImage: 'linear-gradient(95deg, #91F2D7, #8A04F0, #D925A9)' } : undefined}
                >
                  {tag.label}
                </button>
              ))}
            </motion.div>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 7000, disableOnInteraction: false }}
              loop={filtered.length > 1}
              className="!pb-14"
              style={{
                '--swiper-navigation-color': '#FFFFFF',
                '--swiper-navigation-size': '22px',
                '--swiper-pagination-color': '#91F2D7',
                '--swiper-pagination-bullet-inactive-color': '#FFFFFF50',
              }}
            >
              {filtered.map((p) => (
                <SwiperSlide key={p.key || `${p.before}-${p.after}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                    <div className="lg:col-span-8">
                      <BeforeAfterSlider
                        before={p.before}
                        after={p.after}
                        beforeLabel={t('beforeafter.before')}
                        afterLabel={t('beforeafter.after')}
                        className="shadow-lift"
                      />
                    </div>
                    <div className="lg:col-span-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-paper/70 mb-3 font-medium">
                        {tags.find((tg) => tg.id === p.key)?.label || p.tag}
                      </p>
                      <h3 className="font-serif text-3xl lg:text-4xl text-paper tracking-tight">
                        {isEs ? p.title_es : p.title_en}
                      </h3>
                      <p className="mt-4 text-paper/70 leading-relaxed">
                        {isEs ? p.scope_es : p.scope_en}
                      </p>
                      <a
                        href="/portfolio"
                        className="mt-6 inline-flex items-center gap-2 text-sm text-paper border-b border-paper/30 hover:border-paper pb-1 transition-colors"
                      >
                        {isEs ? 'Ver proyecto completo' : 'See full project'} <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <div className="rounded-3xl border border-paper/10 px-8 py-16 text-center">
            <ImageIcon size={32} className="text-paper/40 mx-auto mb-4" aria-hidden="true" />
            <p className="text-paper/70 text-sm">
              {isEs
                ? 'Pronto vamos a cargar transformaciones antes/después desde el admin.'
                : 'Before/after transformations coming soon — add pairs from the admin.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
