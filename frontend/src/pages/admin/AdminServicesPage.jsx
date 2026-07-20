import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Images } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { serviceService, projectService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useForm } from 'react-hook-form'

const empty = {
  slug: '',
  title_en: '',
  title_es: '',
  description_en: '',
  description_es: '',
  long_description_en: '',
  long_description_es: '',
  icon: 'Brush',
  image_url: '',
  long_image_url: '',
  color: '#8A04F0',
  order: 0,
  is_featured: false,
  is_active: true,
}

export const AdminServicesPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => serviceService.list(),
  })

  const createM = useMutation({
    mutationFn: serviceService.create,
    onSuccess: () => { qc.invalidateQueries(['admin-services']); setOpen(false); toast.success('Created') },
  })
  const updateM = useMutation({
    mutationFn: ({ id, data }) => serviceService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-services']); setOpen(false); toast.success('Updated') },
  })
  const deleteM = useMutation({
    mutationFn: serviceService.remove,
    onSuccess: () => { qc.invalidateQueries(['admin-services']); toast.success('Deleted') },
  })

  const filtered = services.filter((s) =>
    s.title_en?.toLowerCase().includes(search.toLowerCase()) ||
    s.title_es?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('admin.card_services')}
      actions={
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm"
        >
          <Plus size={16} /> {t('admin.card_services')}
        </button>
      }
    >
      <div className="p-6 lg:p-12">
        <div className="rounded-3xl bg-paper border border-line overflow-hidden">
          <div className="p-5 border-b border-line flex items-center gap-3">
            <Search size={16} className="text-steel" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div className="divide-y divide-line">
            {filtered.map((s, i) => {
              const galleryCount = (s.projects || []).length
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-5 hover:bg-subtle transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}20`, color: s.color }}
                  >
                    <span className="font-mono text-xs">{i + 1}</span>
                  </div>
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-subtle shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.title_en}</p>
                    <p className="text-xs text-steel truncate">
                      {s.title_es} · /{s.slug}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-paper border ${
                    s.is_active ? 'text-violet border-violet' : 'text-steel border-line'
                  }`}>
                    {s.is_active ? t('admin.badge_published') : t('admin.status_cancelled')}
                  </span>
                  {s.is_featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet/10 text-violet border border-violet/30">
                      {t('admin.badge_featured')}
                    </span>
                  )}
                  {galleryCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-ink">
                      <Images size={10} aria-hidden="true" />
                      {galleryCount}
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditing(s); setOpen(true) }}
                      className="w-9 h-9 rounded-full hover:bg-subtle flex items-center justify-center"
                      aria-label={t('admin.edit')}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirm(s)}
                      className="w-9 h-9 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                      aria-label={t('admin.delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <ServiceModal
          open={open}
          onClose={() => setOpen(false)}
          initial={editing || empty}
          onSubmit={(data) => {
            if (editing) updateM.mutate({ id: editing.id, data })
            else createM.mutate(data)
          }}
        />

        <ConfirmModal
          open={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={() => deleteM.mutate(confirm.id)}
          title="Delete this service?"
        />
      </div>
    </AdminShell>
  )
}

const ServiceModal = ({ open, onClose, initial, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, watch, setValue } = useForm({ defaultValues: initial })
  const [selectedProjectIds, setSelectedProjectIds] = useState(() =>
    (initial?.projects || []).map((p) => p.id)
  )
  const [uploadsInProgress, setUploadsInProgress] = useState(0)
  const isUploading = uploadsInProgress > 0

  useEffect(() => {
    if (initial) {
      reset(initial)
      setSelectedProjectIds((initial.projects || []).map((p) => p.id))
      setUploadsInProgress(0)
    }
  }, [initial, reset])

  const { data: allProjects = [] } = useQuery({
    queryKey: ['admin-projects-all'],
    queryFn: () => projectService.list(),
    enabled: open,
  })

  const selected = useMemo(
    () => selectedProjectIds
      .map((id) => allProjects.find((p) => p.id === id))
      .filter(Boolean),
    [selectedProjectIds, allProjects]
  )
  const available = useMemo(
    () => allProjects.filter((p) => !selectedProjectIds.includes(p.id)),
    [allProjects, selectedProjectIds]
  )

  const addProject = (id) => setSelectedProjectIds((prev) => [...prev, id])
  const removeProject = (id) =>
    setSelectedProjectIds((prev) => prev.filter((pid) => pid !== id))
  const moveProject = (id, dir) =>
    setSelectedProjectIds((prev) => {
      const idx = prev.indexOf(id)
      if (idx < 0) return prev
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })

  const handleUploadingChange = (active) => {
    setUploadsInProgress((current) => Math.max(0, current + (active ? 1 : -1)))
  }

  const onFormSubmit = (data) => {
    if (isUploading) return
    onSubmit({ ...data, project_ids: selectedProjectIds })
  }

  return (
    <Modal open={open} onClose={onClose} closeDisabled={isUploading} title={initial?.id ? 'Edit service' : 'New service'} size="xl">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label={t('admin.field_slug')}>
            <input {...register('slug', { required: true })} className="input-base" placeholder="mural-art" />
          </Input>
          <Input label={t('admin.field_color')}>
            <input type="color" {...register('color')} className="input-base h-12" />
          </Input>
          <Input label="Order">
            <input type="number" {...register('order', { valueAsNumber: true })} className="input-base" />
          </Input>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('admin.field_title_en')}>
            <input {...register('title_en', { required: true })} className="input-base" />
          </Input>
          <Input label={t('admin.field_title_es')}>
            <input {...register('title_es', { required: true })} className="input-base" />
          </Input>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('admin.field_description_en')}>
            <textarea rows={3} {...register('description_en', { required: true })} className="input-base resize-none" />
          </Input>
          <Input label={t('admin.field_description_es')}>
            <textarea rows={3} {...register('description_es', { required: true })} className="input-base resize-none" />
          </Input>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Long description (EN)">
            <textarea rows={3} {...register('long_description_en')} className="input-base resize-none" />
          </Input>
          <Input label="Long description (ES)">
            <textarea rows={3} {...register('long_description_es')} className="input-base resize-none" />
          </Input>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Imagen principal">
            <ImageUploader
              value={watch('image_url') ? [watch('image_url')] : []}
              onChange={(urls) => setValue('image_url', urls[0] || '', { shouldDirty: true })}
              multiple={false}
              maxFiles={1}
              folder="services"
              onUploadingChange={handleUploadingChange}
            />
          </Input>
          <Input label="Imagen de detalle">
            <ImageUploader
              value={watch('long_image_url') ? [watch('long_image_url')] : []}
              onChange={(urls) => setValue('long_image_url', urls[0] || '', { shouldDirty: true })}
              multiple={false}
              maxFiles={1}
              folder="services"
              onUploadingChange={handleUploadingChange}
            />
          </Input>
        </div>

        {/* Gallery picker */}
        <div className="pt-4 border-t border-line">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-ink inline-flex items-center gap-2">
                <Images size={14} aria-hidden="true" />
                Gallery projects
              </h3>
              <p className="text-xs text-steel mt-1">
                Pick which projects show in the public service gallery modal. Order matters — drag with the arrows.
              </p>
            </div>
            <span className="text-xs text-steel tabular-nums">
              {selectedProjectIds.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selected */}
            <div className="rounded-2xl border border-line bg-subtle p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-steel font-semibold mb-2 px-1">
                In gallery
              </p>
              <ul role="list" className="space-y-1.5 min-h-[80px]">
                {selected.length === 0 && (
                  <li className="text-xs text-steel/70 px-2 py-4 text-center">
                    Pick projects from the right →
                  </li>
                )}
                {selected.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-paper border border-line"
                  >
                    {p.cover_image ? (
                      <img src={p.cover_image} alt="" aria-hidden="true" className="w-10 h-10 rounded-lg object-cover shrink-0" loading="lazy" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-ink truncate">{p.title_en}</span>
                      <span className="block text-[10px] text-steel truncate">{p.location || p.year || '—'}</span>
                    </span>
                    <div className="flex items-center shrink-0">
                      <button
                        type="button"
                        onClick={() => moveProject(p.id, -1)}
                        aria-label={`Move ${p.title_en} up`}
                        className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(p.id, 1)}
                        aria-label={`Move ${p.title_en} down`}
                        className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProject(p.id)}
                        aria-label={`Remove ${p.title_en} from gallery`}
                        className="w-7 h-7 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available */}
            <div className="rounded-2xl border border-line bg-paper p-3 max-h-72 overflow-y-auto">
              <p className="text-[11px] uppercase tracking-[0.18em] text-steel font-semibold mb-2 px-1 sticky top-0 bg-paper">
                Available ({available.length})
              </p>
              <ul role="list" className="space-y-1.5">
                {available.length === 0 && (
                  <li className="text-xs text-steel/70 px-2 py-4 text-center">
                    All projects added.
                  </li>
                )}
                {available.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 p-2 rounded-xl border border-line hover:border-violet/40 transition-colors"
                  >
                    {p.cover_image ? (
                      <img src={p.cover_image} alt="" aria-hidden="true" className="w-10 h-10 rounded-lg object-cover shrink-0" loading="lazy" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-ink truncate">{p.title_en}</span>
                      <span className="block text-[10px] text-steel truncate">{p.location || p.year || '—'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => addProject(p.id)}
                      aria-label={`Add ${p.title_en} to gallery`}
                      className="shrink-0 px-2.5 py-1 rounded-full bg-ink text-paper text-[11px] uppercase tracking-[0.14em] font-semibold"
                    >
                      + Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line">
          <div className="flex items-center gap-4 text-xs">
            <label className="inline-flex items-center gap-2 text-charcoal">
              <input type="checkbox" {...register('is_active')} defaultChecked={initial?.is_active !== false} className="accent-violet" />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-charcoal">
              <input type="checkbox" {...register('is_featured')} defaultChecked={!!initial?.is_featured} className="accent-violet" />
              Featured
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 rounded-xl border border-line text-sm disabled:opacity-50">
              {t('admin.cancel')}
            </button>
            <button type="submit" disabled={isUploading} className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm disabled:opacity-50">
              {isUploading ? 'Subiendo…' : t('admin.save')}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
