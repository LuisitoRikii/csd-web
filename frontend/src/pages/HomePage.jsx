import { useTranslation } from 'react-i18next'
import { SEO, buildBusinessSchema } from '@/components/ui/SEO'
import { Hero }           from '@/components/sections/Hero'
import { PromiseBand }    from '@/components/sections/PromiseBand'
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
      ? 'CSD Good Services LLC ofrece servicios profesionales de pintura, remodelación, limpieza y mantenimiento continuo de propiedades en el sur de Florida. Cotizaciones gratuitas.'
      : 'CSD Good Services LLC provides professional painting, remodeling, cleaning and ongoing property maintenance across South Florida. Complimentary estimates.'

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/"
        schema={buildBusinessSchema(lang)}
      />

      <Hero />
      <PromiseBand />
      <About />
      <Services />
      <BeforeAfter />
      <Portfolio />
      <Videos />
      {/*<WhyUs />*/}
      {/*<Process />*/}
      <CTA />
      <Testimonials />
      <MapSection />
      
      <FloatingActions />
    </>
  )
}
