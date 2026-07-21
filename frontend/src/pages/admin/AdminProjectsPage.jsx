import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { projectService, categoryService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { useForm } from 'react-hook-form'

const empty = {
  slug: '',
  title_en: '',
  title_es: '',
  description_en: '',
  description_es: '',
  long_description_en: '',
  long_description_es: '',
  category_id: null,
  location: '',
  client: '',
  cover_image: '',
  video_url: '',
  before_image: '',
  after_image: '',
  services_used: '',
  duration: '',
  year: new Date().getFullYear().toString(),
  is_featured: false,
  is_published: true,
  order: 0,
  show_on_home_videos: false,
  home_videos_order: 0,
  show_on_home_before_after: false,
  home_before_after_order: 0,
  home_before_after_tag: '',
  images: [],
}

export const AdminProjectsPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => projectService.list(),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-cats'],
    queryFn: () => categoryService.list(),
  })

  const createM = useMutation({ mutationFn: projectService.create,
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); setOpen(false); toast.success('Created') } })
  const updateM = useMutation({ mutationFn: ({ id, data }) => projectService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); setOpen(false); toast.success('Updated') } })
  const deleteM = useMutation({ mutationFn: projectService.remove,
    onSuccess: () => { qc.invalidateQueries(['admin-projects']); toast.success('Deleted') } })

  const filtered = projects.filter((p) =>
    p.title_en?.toLowerCase().includes(search.toLowerCase())
  )
  const projectInitial = useMemo(
    () => editing ? { ...editing, images: editing.images?.map((image) => image.image_url) || [] } : empty,
    [editing]
  )

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('admin.card_projects')}
      actions={
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm"
        >
          <Plus size={16} /> {t('admin.field_published')}
        </button>
      }
    >
      <div className="p-6 lg:p-12">
        <div className="rounded-3xl bg-paper border border-line overflow-hidden mb-6">
          <div className="p-5 flex items-center gap-3">
            <Search size={16} className="text-steel" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.search_projects')}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group rounded-3xl bg-paper border border-line overflow-hidden hover:border-ink/30 transition-all"
            >
              <div className="relative aspect-[4/3] bg-subtle">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-steel text-sm">
                    —
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {p.is_featured && <span className="px-2 py-1 rounded-full bg-paper text-brand text-xs border border-brand-light">{t('admin.badge_featured')}</span>}
                  {!p.is_published && <span className="px-2 py-1 rounded-full bg-paper text-steel text-xs border border-line">{t('admin.badge_draft')}</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate text-sm">{p.title_en}</h3>
                <p className="text-xs text-steel truncate mt-1">{p.location} · {p.year}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-steel">{p.view_count || 0} views</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(p); setOpen(true) }} className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center" aria-label={t('admin.edit')}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setConfirm(p)} className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center" aria-label={t('admin.delete')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <ProjectModal
        open={open}
        onClose={() => setOpen(false)}
        initial={projectInitial}
        categories={categories}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
      />

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title={t('admin.delete_project_confirm')}
      />
    </AdminShell>
  )
}

const ProjectModal = ({ open, onClose, initial, categories, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: initial })
  const [uploadsInProgress, setUploadsInProgress] = useState(0)
  const isUploading = uploadsInProgress > 0

  useEffect(() => {
    reset(initial)
    setUploadsInProgress(0)
  }, [initial, reset])

  const handleUploadingChange = (active) => {
    setUploadsInProgress((current) => Math.max(0, current + (active ? 1 : -1)))
  }

  const submit = (data) => {
    if (isUploading) return
    onSubmit({
      ...data,
      category_id: data.category_id ? Number(data.category_id) : null,
      order: Number(data.order) || 0,
      home_videos_order: Number(data.home_videos_order) || 0,
      home_before_after_order: Number(data.home_before_after_order) || 0,
      home_before_after_tag: (data.home_before_after_tag || '').trim() || null,
    })
  }

  return (
    <Modal open={open} onClose={onClose} closeDisabled={isUploading} title={initial?.id ? t('admin.edit') + ' ' + t('admin.field_published') : t('admin.new')} size="lg">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_slug')} required>
            <input {...register('slug', { required: true })} className="input-base" />
          </Input>
          <Input label={t('admin.field_year')}>
            <input {...register('year')} className="input-base" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_title_en')} required><input {...register('title_en', { required: true })} className="input-base" /></Input>
          <Input label={t('admin.field_title_es')} required><input {...register('title_es', { required: true })} className="input-base" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_description_en')} required><textarea rows={3} {...register('description_en', { required: true })} className="input-base resize-none" /></Input>
          <Input label={t('admin.field_description_es')} required><textarea rows={3} {...register('description_es', { required: true })} className="input-base resize-none" /></Input>
        </div>
        <Input label={t('admin.field_cover_image')}>
          <ImageUploader
            value={watch('cover_image') ? [watch('cover_image')] : []}
            onChange={(urls) => setValue('cover_image', urls[0] || '', { shouldDirty: true })}
            multiple={false}
            maxFiles={1}
            folder="projects/images"
            onUploadingChange={handleUploadingChange}
          />
        </Input>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Imagen antes">
            <ImageUploader
              value={watch('before_image') ? [watch('before_image')] : []}
              onChange={(urls) => setValue('before_image', urls[0] || '', { shouldDirty: true })}
              multiple={false}
              maxFiles={1}
              folder="projects/images"
              onUploadingChange={handleUploadingChange}
            />
          </Input>
          <Input label="Imagen después">
            <ImageUploader
              value={watch('after_image') ? [watch('after_image')] : []}
              onChange={(urls) => setValue('after_image', urls[0] || '', { shouldDirty: true })}
              multiple={false}
              maxFiles={1}
              folder="projects/images"
              onUploadingChange={handleUploadingChange}
            />
          </Input>
        </div>
        <Input label="Galería de imágenes">
          <ImageUploader
            value={watch('images') || []}
            onChange={(urls) => setValue('images', urls, { shouldDirty: true })}
            folder="projects/images"
            onUploadingChange={handleUploadingChange}
          />
        </Input>
        <Input label="Vídeo del proyecto">
          <MediaUploader
            type="video"
            value={watch('video_url') ? [watch('video_url')] : []}
            onChange={(urls) => setValue('video_url', urls[0] || '', { shouldDirty: true })}
            multiple={false}
            maxFiles={1}
            folder="projects/videos"
            onUploadingChange={handleUploadingChange}
          />
        </Input>
        <div className="grid grid-cols-3 gap-4">
          <Input label={t('admin.field_category')}>
            <select {...register('category_id')} className="input-base">
              <option value="">—</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </Input>
          <Input label="Location"><input {...register('location')} className="input-base" /></Input>
          <Input label="Client"><input {...register('client')} className="input-base" /></Input>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_featured')} /> {t('admin.badge_featured')}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_published')} /> {t('admin.badge_published')}</label>
        </div>

        <div className="pt-4 border-t border-line space-y-3">
          <p className="text-xs text-steel uppercase tracking-[0.18em] font-semibold">Mostrar en la portada</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line p-4 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input type="checkbox" {...register('show_on_home_videos')} /> Work in Motion
              </label>
              <p className="text-xs text-steel">Aparece en la sección de vídeos del home (requiere vídeo cargado).</p>
              <Input label="Orden">
                <input type="number" {...register('home_videos_order')} className="input-base" />
              </Input>
            </div>
            <div className="rounded-2xl border border-line p-4 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input type="checkbox" {...register('show_on_home_before_after')} /> Antes / después
              </label>
              <p className="text-xs text-steel">Aparece en la comparativa del home (requiere imágenes antes y después).</p>
              <Input label="Orden">
                <input type="number" {...register('home_before_after_order')} className="input-base" />
              </Input>
              <Input label="Etiqueta (cocina, baño, fachada…)">
                <input {...register('home_before_after_tag')} className="input-base" placeholder="kitchen" />
              </Input>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 rounded-xl border border-line text-sm disabled:opacity-50">{t('admin.cancel')}</button>
          <button type="submit" disabled={isUploading} className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm disabled:opacity-50">{isUploading ? 'Subiendo…' : t('admin.save')}</button>
        </div>
      </form>
    </Modal>
  )
}
