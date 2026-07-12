import api from './api'

const unwrap = (p) => p.then((r) => r.data)

export const authService = {
  login: (payload) => unwrap(api.post('/auth/login', payload)),
  me: () => unwrap(api.get('/auth/me')),
  logout: () => {
    localStorage.removeItem('csd_token')
    localStorage.removeItem('csd_user')
  },
}

export const serviceService = {
  list: (params = {}) => unwrap(api.get('/services', { params })),
  get: (slug) => unwrap(api.get(`/services/${slug}`)),
  create: (data) => unwrap(api.post('/services', data)),
  update: (id, data) => unwrap(api.put(`/services/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/services/${id}`)),
}

export const projectService = {
  list: (params = {}) => unwrap(api.get('/projects', { params })),
  get: (slug) => unwrap(api.get(`/projects/${slug}`)),
  create: (data) => unwrap(api.post('/projects', data)),
  update: (id, data) => unwrap(api.put(`/projects/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/projects/${id}`)),
  addImage: (id, url) =>
    unwrap(api.post(`/projects/${id}/images`, null, { params: { image_url: url } })),
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
  list: (params = {}) => unwrap(api.get('/blog', { params })),
  get: (slug) => unwrap(api.get(`/blog/${slug}`)),
  create: (data) => unwrap(api.post('/blog', data)),
  update: (id, data) => unwrap(api.put(`/blog/${id}`, data)),
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
}

export const userService = {
  list: (params = {}) => unwrap(api.get('/users', { params })),
  create: (data) => unwrap(api.post('/users', data)),
  update: (id, data) => unwrap(api.put(`/users/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/users/${id}`)),
}

export const uploadService = {
  image: (file, folder = 'images') => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    return unwrap(api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } }))
  },
  images: (files, folder = 'images') => {
    const form = new FormData()
    Array.from(files).forEach((f) => form.append('files', f))
    form.append('folder', folder)
    return unwrap(api.post('/upload/images', form, { headers: { 'Content-Type': 'multipart/form-data' } }))
  },
  video: (file, folder = 'videos') => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    return unwrap(api.post('/upload/video', form, { headers: { 'Content-Type': 'multipart/form-data' } }))
  },
  remove: (url) => unwrap(api.delete('/upload/delete', { params: { url } })),
}
