import { useTranslation } from 'react-i18next'
import { SEO, buildBusinessSchema } from '@/components/ui/SEO'
import { Hero }           from '@/components/sections/Hero'
import { Marquee }        from '@/components/sections/Marquee'
import { About }          from '@/components/sections/About'
import { Services }       from '@/components/sections/Services'
import { BeforeAfter }    from '@/components/sections/BeforeAfter'
import { Portfolio }      from '@/components/sections/Portfolio'
import { Videos }         from '@/components/sections/Videos'
import { WhyUs }          from '@/components/sections/WhyUs'
import { Process }        from '@/components/sections/Process'
import { Testimonials }   from '@/components/sections/Testimonials'
import { CTA }            from '@/components/sections/CTA'
import { MapSection }     from '@/components/sections/MapSection'
import { FloatingActions } from '@/components/layout/FloatingActions'

export const HomePage = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const title =
    lang === 'es'
      ? 'CSD Good Services | Servicios del Hogar en Miami — Pintura, Remodelación, Limpieza'
      : 'CSD Good Services | Miami Home Services — Painting, Remodeling, Cleaning'

  const description =
    lang === 'es'
      ? 'Empresa de servicios del hogar en Miami: pintura, remodelación, limpieza y mantenimiento continuo. Un equipo para todo lo que tu casa necesita. Cotizaciones gratis en todo el sur de Florida.'
      : 'Miami home services company for painting, remodeling, cleaning and ongoing home maintenance. One team for everything your home needs. Free estimates across South Florida.'

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/"
        schema={buildBusinessSchema(lang)}
      />

      <Hero />
      <About />
      <Services />
      <BeforeAfter />
      <Portfolio />
      <Videos />
      {/*<WhyUs />*/}
      <Process />
      <Testimonials />
      <MapSection />
      <CTA />
      <FloatingActions />
    </>
  )
}
