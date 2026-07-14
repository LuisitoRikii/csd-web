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
    <section id="about" className="relative py-32 lg:py-48">
      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <motion.h2
              {...fade}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-display-lg tracking-tight text-paper"
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
              <div className="absolute bottom-6 left-6 right-6 bg-ink/70 backdrop-blur-md border border-paper/10 rounded-2xl p-5">
                <p className="text-sm italic font-serif text-paper">{t('about.story_caption')}</p>
                <p className="mt-2 text-xs text-paper/60 tracking-[0.2em] uppercase">{t('about.signature')}</p>
              </div>
            </motion.div>

            <motion.p {...fade} className="text-xl lg:text-2xl font-serif leading-snug text-paper">
              {t('about.p1')}
            </motion.p>
            <motion.p {...fade} className="mt-6 text-base text-paper/85 leading-relaxed">
              {t('about.p2')}
            </motion.p>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative rounded-2xl border border-paper/15 bg-paper/[0.06] backdrop-blur-xl p-7 overflow-hidden transition-colors duration-500 hover:bg-paper/[0.1]"
                >
                  {/* Drip accent, echoing the painted background */}
                  <svg width="40" height="52" viewBox="0 0 40 52" className="mb-4 block" aria-hidden="true">
                    <path
                      d="M20 0 C20 0 37 24 37 35 A17 17 0 1 1 3 35 C3 24 20 0 20 0 Z"
                      fill={v.color}
                      fillOpacity="0.85"
                    />
                    <circle cx="20" cy="8" r="8" fill={v.color} fillOpacity="0.18" />
                    <Check size={14} strokeWidth={2.5} color="#0B0B12" x="13" y="26" />
                  </svg>

                  <h4 className="font-serif text-xl tracking-tight text-paper mb-1.5">{v.title}</h4>
                  <p className="text-sm text-paper/70 leading-relaxed">{v.desc}</p>

                  <div
                    className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                    style={{ background: v.color }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}