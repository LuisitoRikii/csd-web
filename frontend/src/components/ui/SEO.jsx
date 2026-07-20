import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { APP_BASE_URL, BUSINESS } from '@/config'

const BASE = APP_BASE_URL.replace(/\/$/, '')
const DEFAULT_OG = `${BASE}/og-image.jpg`

export const SEO = ({
  title,
  description,
  path = '/',
  image = DEFAULT_OG,
  type = 'website',
  schema,
  noindex = false,
}) => {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const fullTitle = title?.includes('CSD')
    ? title
    : `${title} | CSD Good Services`

  const canonical = `${BASE}${path}`
  const enUrl = canonical
  const esUrl = `${canonical}${path === '/' ? '' : path}${path.includes('?') ? '&' : '?'}lang=es`

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="CSD Good Services" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="es_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}

export const buildBusinessSchema = (lang, extras = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  '@id': `${BASE}/#business`,
  name: BUSINESS.name,
  url: BASE,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  image: DEFAULT_OG,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '8215 NW 64th Street',
    addressLocality: 'Medley',
    addressRegion: 'FL',
    postalCode: '33166',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.8617,
    longitude: -80.3189,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  knowsLanguage: ['en', 'es'],
  description:
    lang === 'es'
      ? 'Pintura, remodelación, reparaciones, resina epóxica, murales personalizados y limpieza en Miami. Calidad y oficio desde 2014.'
      : 'Painting, remodeling, repairs, epoxy resin, custom murals and cleaning in Miami. Quality craftsmanship since 2014.',
  ...extras,
})

export const buildFaqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
})

export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${BASE}${item.path}`,
  })),
})
