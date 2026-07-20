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
      ? 'CSD Good Services | Pintura, Remodelación y Epóxico en Miami'
      : 'CSD Good Services | Painting, Remodeling & Epoxy in Miami'

  const description =
    lang === 'es'
      ? 'Pintura, remodelación, reparaciones, resina epóxica, murales personalizados y limpieza en Miami. Calidad y oficio desde 2014. Solicita tu presupuesto gratis.'
      : 'Licensed Miami contractor for interior & exterior painting, epoxy resin, custom murals, home remodeling and recurring property maintenance. Free estimates across South Florida.'

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
