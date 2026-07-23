import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, ShieldCheck, CalendarCheck } from 'lucide-react'
import { IMG } from './Hero'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export const About = () => {
  const { t } = useTranslation()
  const { about } = useSiteSettings()

  const stats = [
    { icon: MapPin, label: t('about.based_in') },
    { icon: ShieldCheck, label: t('about.locally_owned') },
    { icon: CalendarCheck, label: t('about.since_2014') },
  ]

  return (
    <section id="about" className="relative pt-20 lg:pt-28 bg-canvas border-t border-line pb-16">
      <div className="container-x">

        {/* Encabezado centrado y simple, sin columna sticky */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mt-4 font-serif text-display-md tracking-tight text-ink text-balance">
            {t('about.title_l1')} {t('about.title_l2')}
          </h2>
          <p className="mt-5 text-steel text-base lg:text-lg leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Imagen + texto, dos columnas parejas, sin sticky ni asimetría editorial */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-muted order-1">
            <img
              src={about.imageUrl || about.imageFallbackUrl || IMG.paintingInterior}
              alt={t('about.story_caption')}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="order-2">
            <p className="text-base text-steel leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="mt-4 text-base text-steel leading-relaxed">
              {t('about.p2')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary">
                {t('about.about_cta')} <ArrowUpRight size={14} />
              </Link>
              <Link to="/contact" className="btn-secondary">
                {t('about.quote_cta')}
              </Link>
            </div>
          </div>
        </div>

        {/* Franja de datos con íconos, estilo "proceso" en vez de blockquote editorial */}
        <div className="mt-16 lg:mt-20 pt-12 border-t border-line grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-4 justify-center sm:justify-start">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-muted shrink-0">
                <Icon size={18} className="text-ink" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-medium text-ink">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}