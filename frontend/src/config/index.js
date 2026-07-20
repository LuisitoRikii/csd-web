export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const APP_BASE_URL =
  import.meta.env.VITE_APP_URL || 'http://localhost:5173'

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
  import.meta.env.VITE_WHATSAPP || '13055550123'

export const BUSINESS = {
  name: 'CSD Good Services',
  phone: '+1 (305) 555-0123',
  email: 'info@csdgoodservices.com',
  address: '8215 NW 64th Street, Medley, FL 33166',
  hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
}

export const SOCIAL = {
  instagram: 'https://www.instagram.com/csd_good_services/',
  facebook: 'https://facebook.com/csdgoodservices',
  tiktok: 'https://tiktok.com/@csdgoodservices',
  youtube: '',
}
