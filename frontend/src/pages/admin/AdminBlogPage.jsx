import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { blogService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useForm } from 'react-hook-form'
import { formatDate } from '@/utils/cn'

const empty = {
  slug: '',
  title_en: '',
  title_es: '',
  excerpt_en: '',
  excerpt_es: '',
  content_en: '',
  content_es: '',
  cover_image: '',
  category: 'general',
  tags: '',
  author: 'CSD Good Services',
  read_time: 5,
  is_featured: false,
  is_published: false,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
}

export const AdminBlogPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const { data: posts = [] } = useQuery({ queryKey: ['admin-blog'], queryFn: () => blogService.list({ published_only: false }) })

  const createM = useMutation({ mutationFn: blogService.create, onSuccess: () => { qc.invalidateQueries(['admin-blog']); setOpen(false); toast.success('Created') } })
  const updateM = useMutation({ mutationFn: ({ id, data }) => blogService.update(id, data), onSuccess: () => { qc.invalidateQueries(['admin-blog']); setOpen(false); toast.success('Updated') } })
  const deleteM = useMutation({ mutationFn: blogService.remove, onSuccess: () => { qc.invalidateQueries(['admin-blog']); toast.success('Deleted') } })

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('nav.blog')}
      actions={
        <button onClick={() => { setEditing(null); setOpen(true) }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm">
          <Plus size={16} /> {t('admin.field_published')}
        </button>
      }
    >
      <div className="p-6 lg:p-12">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {posts.map((p) => (
          <div key={p.id} className="rounded-3xl bg-paper border border-line p-4 flex gap-4">
            <div className="w-32 h-32 rounded-2xl bg-subtle overflow-hidden flex-shrink-0">
              {p.cover_image && <img src={p.cover_image} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full bg-paper border ${
                  p.is_published ? 'text-brand border-brand' : 'text-steel border-line'
                }`}>
                  {p.is_published ? t('admin.badge_published') : t('admin.badge_draft')}
                </span>
                {p.is_featured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-tint text-brand border border-brand-light">{t('admin.badge_featured')}</span>}
                <span className="text-xs text-steel">{formatDate(p.published_at || p.created_at, 'en')}</span>
              </div>
              <h3 className="font-medium truncate">{p.title_en}</h3>
              <p className="text-xs text-steel line-clamp-2 mt-1">{p.excerpt_en}</p>
              <div className="flex gap-1 mt-3">
                <Link to={`/blog/${p.slug}`} target="_blank" className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center" aria-label={t('common.share')}><Eye size={14} /></Link>
                <button onClick={() => { setEditing(p); setOpen(true) }} className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center" aria-label={t('admin.edit')}><Edit2 size={14} /></button>
                <button onClick={() => setConfirm(p)} className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center" aria-label={t('admin.delete')}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PostModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing || empty}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
      />
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title={t('admin.delete_post_confirm')}
      />
      </div>
    </AdminShell>
  )
}

const PostModal = ({ open, onClose, initial, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: initial })
  const [isUploading, setIsUploading] = useState(false)
  useEffect(() => {
    if (initial) reset(initial)
    setIsUploading(false)
  }, [initial, reset])

  return (
    <Modal open={open} onClose={onClose} closeDisabled={isUploading} title={initial?.id ? t('admin.edit') : t('admin.new')} size="lg">
      <form onSubmit={handleSubmit((data) => { if (!isUploading) onSubmit(data) })} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_slug')}><input {...register('slug', { required: true })} className="input-base" /></Input>
          <Input label={t('admin.field_category')}><input {...register('category')} className="input-base" placeholder={t('admin.field_slug_placeholder')} /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_title_en')}><input {...register('title_en', { required: true })} className="input-base" /></Input>
          <Input label={t('admin.field_title_es')}><input {...register('title_es', { required: true })} className="input-base" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_excerpt_en')}><textarea rows={2} {...register('excerpt_en', { required: true })} className="input-base resize-none" /></Input>
          <Input label={t('admin.field_excerpt_es')}><textarea rows={2} {...register('excerpt_es', { required: true })} className="input-base resize-none" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_content_en')}><textarea rows={8} {...register('content_en', { required: true })} className="input-base resize-y" /></Input>
          <Input label={t('admin.field_content_es')}><textarea rows={8} {...register('content_es', { required: true })} className="input-base resize-y" /></Input>
        </div>
        <Input label={t('admin.field_cover_image')}>
          <ImageUploader
            value={watch('cover_image') ? [watch('cover_image')] : []}
            onChange={(urls) => setValue('cover_image', urls[0] || '', { shouldDirty: true })}
            onUploadingChange={setIsUploading}
            multiple={false}
            maxFiles={1}
            folder="blog"
          />
        </Input>
        <div className="grid grid-cols-3 gap-4">
          <Input label={t('admin.field_read_time')}><input type="number" {...register('read_time')} className="input-base" /></Input>
          <Input label="Tags"><input {...register('tags')} className="input-base" /></Input>
          <Input label="Author"><input {...register('author')} className="input-base" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Meta title (SEO)"><input {...register('meta_title')} className="input-base" /></Input>
          <Input label="Meta keywords"><input {...register('meta_keywords')} className="input-base" /></Input>
        </div>
        <Input label="Meta description (SEO)"><textarea rows={2} {...register('meta_description')} className="input-base resize-none" /></Input>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_featured')} /> {t('admin.badge_featured')}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_published')} /> {t('admin.badge_published')}</label>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 rounded-xl border border-line text-sm disabled:opacity-50">{t('admin.cancel')}</button>
          <button type="submit" disabled={isUploading} className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm disabled:opacity-50">{isUploading ? 'Subiendo…' : t('admin.save')}</button>
        </div>
      </form>
    </Modal>
  )
}
