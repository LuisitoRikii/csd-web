import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { APP_BASE_URL, BUSINESS } from '@/config'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { Process } from '@/components/sections/Process'
import { Testimonials } from '@/components/sections/Testimonials'
import { CTA } from '@/components/sections/CTA'
import { VerticalBrushConnector, TippedBucketDrip } from '@/components/svg/PaintConnectors'
import { PaintRevealSection } from '@/components/svg/PaintRevealSection'
import { FloatingActions } from '@/components/layout/FloatingActions'

export const HomePage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    image: `${APP_BASE_URL}/og-image.jpg`,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8215 NW 64th Street',
      addressLocality: 'Medley',
      addressRegion: 'FL',
      postalCode: '33166',
      addressCountry: 'US',
    },
    priceRange: '$$',
    openingHours: 'Mo-Sa 08:00-18:00',
    url: APP_BASE_URL,
    description: lang === 'es'
      ? 'Murales artísticos, pisos epóxicos, remodelaciones y pintura premium en Miami.'
      : 'Artistic murals, epoxy flooring, remodeling and premium painting in Miami.',
  }

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>
          {lang === 'es'
            ? 'CSD Good Services | Transformaciones Premium de Espacios'
            : 'CSD Good Services | Premium Space Transformations'}
        </title>
        <meta name="description" content={
          lang === 'es'
            ? 'Murales artísticos, pisos epóxicos, remodelaciones y pintura premium en Miami. Transforma tu espacio con CSD Good Services.'
            : 'Artistic murals, epoxy flooring, remodeling and premium painting in Miami. Transform your space with CSD Good Services.'
        } />
        <link rel="canonical" href={APP_BASE_URL} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Hero />
      <Marquee />
      <PaintRevealSection>
        <About />
        <Services />
      </PaintRevealSection>
      <Portfolio />
      <Process />
      <Testimonials />
      <CTA />
      <FloatingActions />
    </>
  )
}
