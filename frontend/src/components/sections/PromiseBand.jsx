import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { IMG } from './Hero'

const ROTATE_MS = 5000

const RotatingImage = ({ images, alt, fallback }) => {
  const safeImages = images?.length ? images : (fallback ? [fallback] : [])
  const [index, setIndex] = useState(0)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    if (safeImages.length < 2) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % safeImages.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [safeImages.length])

  const current = errored ? fallback : safeImages[index]

  return (
    <div className="relative h-64 lg:h-full w-full overflow-hidden bg-ink">
      <AnimatePresence mode="wait">
        {current ? (
          <motion.img
            key={current}
            src={current}
            alt={alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onError={() => fallback && setErrored(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export const PromiseBand = () => {
  const { t } = useTranslation()
  const { promise } = useSiteSettings()
  const fallback = IMG.paintingInterior

  return (
    <section className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="hidden lg:block">
          <RotatingImage
            images={promise.leftImages}
            alt={t('promise.image_alt_left')}
            fallback={fallback}
          />
        </div>

        <div className="block lg:hidden">
          <RotatingImage
            images={promise.leftImages}
            alt={t('promise.image_alt_left')}
            fallback={fallback}
          />
        </div>

        <div className="flex flex-col">
          <div className="bg-magenta px-8 py-6 lg:py-8 flex flex-col items-center justify-center text-center">
            <span className="font-serif text-paper text-lg lg:text-xl tracking-wide">
              {t('promise.brand_name')}
            </span>
            <span className="mt-1 text-paper/85 text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              {t('promise.brand_subtitle')}
            </span>
          </div>

          <div className="bg-ink flex-1 px-8 py-10 lg:py-14 flex flex-col items-center text-center justify-center">
            <h2 className="font-serif text-paper text-display-sm lg:text-display-md tracking-tight text-balance">
              {t('promise.title')}
            </h2>
            <p className="mt-5 max-w-md text-paper/75 text-sm lg:text-base leading-relaxed">
              {t('promise.description')}
            </p>
            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber-300"
            >
              {t('promise.cta')}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <RotatingImage
            images={promise.rightImages}
            alt={t('promise.image_alt_right')}
            fallback={fallback}
          />
        </div>
      </div>
    </section>
  )
}
