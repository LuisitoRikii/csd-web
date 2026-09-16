export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://apiprueba.jltechnology.com.uy/api/v1'

export const APP_BASE_URL =
  import.meta.env.VITE_APP_URL || 'https://apiprueba.jltechnology.com.uy'

export const MEDIA_BASE_URL =
  import.meta.env.VITE_MEDIA_URL || (import.meta.env.VITE_API_URL || '').replace(/\/api\/v1\/?$/, '')

export const resolveMediaUrl = (url) => {
  if (!url || /^(https?:|data:|blob:)/.test(url)) return url
  if (!url.startsWith('/uploads/')) return url
  return `${MEDIA_BASE_URL.replace(/\/$/, '')}${url}`
}

export const toStoredMediaUrl = (url) => {
  if (!url) return url
  const base = MEDIA_BASE_URL.replace(/\/$/, '')
  return url.startsWith(`${base}/uploads/`) ? url.slice(base.length) : url
}

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP || '17862957057'

export const BUSINESS = {
  name: 'CSD Good Services',
  phone: '+1 (786) 295-7057',
  phones: ['+1 (786) 295-7057', '+1 (863) 488-6716'],
  email: 'admin@csdgoodservices.com',
  address: '8215 NW 64th Street, Medley, FL 33166',
  hours: '8:00 AM - 6:00 PM',
}

export const SOCIAL = {
  instagram: 'https://www.instagram.com/csd_good_services/',
  facebook: 'https://facebook.com/csdgoodservices',
  tiktok: 'https://tiktok.com/@csdgoodservices',
  youtube: '',
}
