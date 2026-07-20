import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { RevealText } from '@/components/ui/RevealText'
import { IMG } from './Hero'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
}

export const About = () => {
  const { t } = useTranslation()
  const { about } = useSiteSettings()

  return (
    <section id="about" className="relative py-24 lg:py-36 bg-paper">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Title column — sticky on desktop so the title stays pinned while
              the right column scrolls past. No transforms applied so the
              sticky behavior is not overridden. */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            <h2 className="font-serif text-display-lg tracking-tight text-ink text-balance">
              <RevealText as="span" text={t('about.title_l1')} staggerChildren={0.06} />
              <br />
              <span className="italic font-light text-charcoal">
                <RevealText as="span" text={t('about.title_l2')} staggerChildren={0.06} delay={0.18} />
              </span>
            </h2>

            <motion.div {...fade} className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary">
                {t('about.about_cta')} <ArrowUpRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-ink/20 text-ink text-sm font-medium hover:bg-ink hover:text-paper hover:border-ink transition-all"
              >
                {t('about.quote_cta')}
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              {...fade}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] mb-12"
            >
              <img
                src={about.imageUrl || IMG.paintingInterior}
                alt={t('about.story_caption')}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.p
              {...fade}
              className="text-xl lg:text-2xl font-serif leading-snug text-ink"
            >
              {t('about.p1')}
            </motion.p>
            <motion.p
              {...fade}
              className="mt-5 text-base text-charcoal/85 leading-relaxed"
            >
              {t('about.p2')}
            </motion.p>
          </div>
        </div>

        {/* Editorial statement — the values inline below the story */}
        <motion.figure
          {...fade}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-20 lg:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-t border-line pt-14"
        >
          <div className="lg:col-span-7">
            <p className="font-serif text-2xl md:text-3xl lg:text-[2.4rem] text-ink leading-[1.2] tracking-tight font-light text-balance">
              {t('about.editorial_quote')}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-steel">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                {t('about.based_in')}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                {t('about.licensed_insured')}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                {t('about.since_2014')}
              </span>
            </div>
          </div>
        </motion.figure>
      </div>
    </section>
  )
}
