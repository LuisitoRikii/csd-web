import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

export const About = () => {
  const { t } = useTranslation()

  const values = [
    { title: t('about.value_1_title'), desc: t('about.value_1_desc'), color: '#06B6D4' },
    { title: t('about.value_2_title'), desc: t('about.value_2_desc'), color: '#8B5CF6' },
    { title: t('about.value_3_title'), desc: t('about.value_3_desc'), color: '#D946EF' },
    { title: t('about.value_4_title'), desc: t('about.value_4_desc'), color: '#F97316' },
  ]

  return (
    <section id="about" className="relative py-32 lg:py-48 bg-canvas">
      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <motion.h2
              {...fade}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-display-lg tracking-tight"
            >
              {t('about.title_l1')}
              <br />
              <span className="italic font-light">{t('about.title_l2')}</span>
            </motion.h2>
          </div>

          <div className="lg:col-span-7 lg:pt-32">
            <motion.div
              {...fade}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] mb-16"
            >
              <img
                src="https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1600&auto=format&fit=crop&q=85"
                alt="Mural artist at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-canvas/90 backdrop-blur-sm rounded-2xl p-5">
                <p className="text-sm italic font-serif">{t('about.story_caption')}</p>
                <p className="mt-2 text-xs text-steel tracking-[0.2em] uppercase">{t('about.signature')}</p>
              </div>
            </motion.div>

            <motion.p {...fade} className="text-xl lg:text-2xl font-serif leading-snug text-charcoal">
              {t('about.p1')}
            </motion.p>
            <motion.p {...fade} className="mt-6 text-base text-charcoal/85 leading-relaxed">
              {t('about.p2')}
            </motion.p>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="bg-canvas p-7"
                >
                  <div
                    className="w-10 h-10 rounded-full mb-4 flex items-center justify-center"
                    style={{ background: `${v.color}15` }}
                  >
                    <Check size={16} style={{ color: v.color }} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-serif text-xl tracking-tight mb-1.5">{v.title}</h4>
                  <p className="text-sm text-charcoal/80 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}