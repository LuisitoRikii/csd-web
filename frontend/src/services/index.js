import api from './api'
import { resolveMediaUrl, toStoredMediaUrl } from '@/config'

const unwrap = (p) => p.then((r) => r.data)
const downloadBlob = (request, fallbackName) => request.then((response) => {
  const disposition = response.headers['content-disposition'] || ''
  const match = disposition.match(/filename="?([^";]+)"?/i)
  const href = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = href
  link.download = match?.[1] || fallbackName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
})

const normalizeProject = (project) => project ? {
  ...project,
  cover_image: resolveMediaUrl(project.cover_image),
  video_url: resolveMediaUrl(project.video_url),
  before_image: resolveMediaUrl(project.before_image),
  after_image: resolveMediaUrl(project.after_image),
  images: project.images?.map((image) => ({ ...image, image_url: resolveMediaUrl(image.image_url) })) || [],
} : project

const storeProject = (project) => ({
  ...project,
  cover_image: toStoredMediaUrl(project.cover_image),
  video_url: toStoredMediaUrl(project.video_url),
  before_image: toStoredMediaUrl(project.before_image),
  after_image: toStoredMediaUrl(project.after_image),
  images: project.images?.map((image) => toStoredMediaUrl(image.image_url || image)),
})

const normalizeService = (service) => service ? {
  ...service,
  image_url: resolveMediaUrl(service.image_url),
  long_image_url: resolveMediaUrl(service.long_image_url),
  projects: service.projects?.map(normalizeProject) || [],
} : service

const storeService = (service) => ({
  ...service,
  image_url: toStoredMediaUrl(service.image_url),
  long_image_url: toStoredMediaUrl(service.long_image_url),
})

const normalizePost = (post) => post ? { ...post, cover_image: resolveMediaUrl(post.cover_image) } : post
const storePost = (post) => ({ ...post, cover_image: toStoredMediaUrl(post.cover_image) })

export const authService = {
  login: (payload) => unwrap(api.post('/auth/login', payload)),
  me: () => unwrap(api.get('/auth/me')),
  changePassword: (payload) => unwrap(api.post('/auth/change-password', payload)),
  logout: () => {
    localStorage.removeItem('csd_token')
    localStorage.removeItem('csd_user')
  },
}

export const serviceService = {
  list: (params = {}) => unwrap(api.get('/services', { params })).then((items) => items.map(normalizeService)),
  get: (slug) => unwrap(api.get(`/services/${slug}`)).then(normalizeService),
  create: (data) => unwrap(api.post('/services', storeService(data))).then(normalizeService),
  update: (id, data) => unwrap(api.put(`/services/${id}`, storeService(data))).then(normalizeService),
  remove: (id) => unwrap(api.delete(`/services/${id}`)),
  setProjects: (id, projectIds) => unwrap(api.put(`/services/${id}/projects`, projectIds)).then(normalizeService),
}

export const projectService = {
  list: (params = {}) => unwrap(api.get('/projects', { params })).then((items) => items.map(normalizeProject)),
  get: (slug) => unwrap(api.get(`/projects/${slug}`)).then(normalizeProject),
  create: (data) => unwrap(api.post('/projects', storeProject(data))).then(normalizeProject),
  update: (id, data) => unwrap(api.put(`/projects/${id}`, storeProject(data))).then(normalizeProject),
  remove: (id) => unwrap(api.delete(`/projects/${id}`)),
  addImage: (id, url) =>
    unwrap(api.post(`/projects/${id}/images`, null, { params: { image_url: toStoredMediaUrl(url) } })).then(normalizeProject),
  removeImage: (id, imgId) => unwrap(api.delete(`/projects/${id}/images/${imgId}`)),
}

export const categoryService = {
  list: () => unwrap(api.get('/categories')),
  get: (slug) => unwrap(api.get(`/categories/${slug}`)),
  create: (data) => unwrap(api.post('/categories', data)),
  update: (id, data) => unwrap(api.put(`/categories/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/categories/${id}`)),
}

export const quoteService = {
  create: (data) => unwrap(api.post('/quotes', data)),
  list: (params = {}) => unwrap(api.get('/quotes', { params })),
  get: (id) => unwrap(api.get(`/quotes/${id}`)),
  update: (id, data) => unwrap(api.put(`/quotes/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/quotes/${id}`)),
}

export const appointmentService = {
  create: (data) => unwrap(api.post('/appointments', data)),
  list: (params = {}) => unwrap(api.get('/appointments', { params })),
  get: (id) => unwrap(api.get(`/appointments/${id}`)),
  update: (id, data) => unwrap(api.put(`/appointments/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/appointments/${id}`)),
}

export const blogService = {
  list: (params = {}) => unwrap(api.get('/blog', { params })).then((items) => items.map(normalizePost)),
  get: (slug) => unwrap(api.get(`/blog/${slug}`)).then(normalizePost),
  create: (data) => unwrap(api.post('/blog', storePost(data))).then(normalizePost),
  update: (id, data) => unwrap(api.put(`/blog/${id}`, storePost(data))).then(normalizePost),
  remove: (id) => unwrap(api.delete(`/blog/${id}`)),
}

export const contactService = {
  send: (data) => unwrap(api.post('/contact', data)),
  list: (params = {}) => unwrap(api.get('/contact', { params })),
  markRead: (id) => unwrap(api.put(`/contact/${id}/read`)),
  remove: (id) => unwrap(api.delete(`/contact/${id}`)),
}

export const settingsService = {
  public: () => unwrap(api.get('/settings/public')),
  grouped: () => unwrap(api.get('/settings/grouped')),
  list: (params = {}) => unwrap(api.get('/settings', { params })),
  bulkUpdate: (data) => unwrap(api.put('/settings/bulk', data)),
  update: (id, data) => unwrap(api.put(`/settings/${id}`, data)),
}

export const dashboardService = {
  stats: () => unwrap(api.get('/dashboard/stats')),
  recent: () => unwrap(api.get('/dashboard/recent')),
  charts: (days = 30) => unwrap(api.get('/dashboard/charts', { params: { days } })),
}

export const filesService = {
  tree: (path = '', depth = 3) =>
    unwrap(api.get('/files/tree', { params: { path, depth } })),
  diskUsage: () => unwrap(api.get('/files/disk-usage')),
  download: (path) => downloadBlob(
    api.get('/files/download', { params: { path }, responseType: 'blob', timeout: 0 }),
    path.split('/').pop() || 'file'
  ),
  downloadZip: (path = '') => downloadBlob(
    api.get('/files/download-zip', { params: { path }, responseType: 'blob', timeout: 0 }),
    `${path.split('/').pop() || 'uploads'}.zip`
  ),
  upload: (file, path = '') => {
    const form = new FormData()
    form.append('file', file)
    return unwrap(
      api.post(`/files/upload?path=${encodeURIComponent(path)}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      })
    )
  },
  remove: (path) => unwrap(api.delete('/files', { params: { path } })),
}

export const userService = {
  list: (params = {}) => unwrap(api.get('/users', { params })),
  create: (data) => unwrap(api.post('/users', data)),
  update: (id, data) => unwrap(api.put(`/users/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/users/${id}`)),
  resetPassword: (id, newPassword) =>
    unwrap(api.post(`/users/${id}/reset-password`, { new_password: newPassword })),
}

export const uploadService = {
  image: (file, folder = 'images') => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    return unwrap(api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 300000 }))
  },
  images: (files, folder = 'images') => {
    const form = new FormData()
    Array.from(files).forEach((f) => form.append('files', f))
    form.append('folder', folder)
    return unwrap(api.post('/upload/images', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 300000 }))
  },
  video: (file, folder = 'videos') => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    return unwrap(api.post('/upload/video', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 300000 }))
  },
  remove: (url) => unwrap(api.delete('/upload/delete', { params: { url } })),
}
