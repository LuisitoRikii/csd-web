import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoryService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
import { useForm } from 'react-hook-form'

const empty = { slug: '', name_en: '', name_es: '', description_en: '', description_es: '', icon: 'Palette', color: '#5B2A8F', order: 0 }

export const AdminCategoriesPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const { data: cats = [] } = useQuery({ queryKey: ['admin-cats'], queryFn: () => categoryService.list() })
  const createM = useMutation({ mutationFn: categoryService.create, onSuccess: () => { qc.invalidateQueries(['admin-cats']); setOpen(false); toast.success('Created') } })
  const updateM = useMutation({ mutationFn: ({ id, data }) => categoryService.update(id, data), onSuccess: () => { qc.invalidateQueries(['admin-cats']); setOpen(false); toast.success('Updated') } })
  const deleteM = useMutation({ mutationFn: categoryService.remove, onSuccess: () => { qc.invalidateQueries(['admin-cats']); toast.success('Deleted') } })

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('admin.field_category')}
      actions={
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm"
        >
          <Plus size={16} /> {t('admin.field_category')}
        </button>
      }
    >
      <div className="p-6 lg:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((c) => (
            <div key={c.id} className="rounded-3xl bg-paper border border-line p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-paper font-serif" style={{ background: c.color }}>
                {c.name_en?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{c.name_en}</p>
                <p className="text-xs text-steel truncate">{c.description_en}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(c); setOpen(true) }} className="w-9 h-9 rounded-full hover:bg-subtle flex items-center justify-center" aria-label={t('admin.edit')}><Edit2 size={14} /></button>
                <button onClick={() => setConfirm(c)} className="w-9 h-9 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center" aria-label={t('admin.delete')}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing || empty}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
      />
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title={t('admin.delete_category_confirm')}
      />
    </AdminShell>
  )
}

const CategoryModal = ({ open, onClose, initial, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial })
  useEffect(() => { if (initial) reset(initial) }, [initial, reset])
  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? t('admin.edit') + ' ' + t('admin.field_category') : t('admin.new') + ' ' + t('admin.field_category')} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_slug')} required>
            <input {...register('slug', { required: true })} className="input-base" />
          </Input>
          <Input label={t('admin.field_color')}>
            <input type="color" {...register('color')} className="input-base h-12" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_name_en')} required>
            <input {...register('name_en', { required: true })} className="input-base" />
          </Input>
          <Input label={t('admin.field_name_es')} required>
            <input {...register('name_es', { required: true })} className="input-base" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_description_en')}>
            <input {...register('description_en')} className="input-base" />
          </Input>
          <Input label={t('admin.field_description_es')}>
            <input {...register('description_es')} className="input-base" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('admin.field_icon')}>
            <input {...register('icon')} className="input-base" />
          </Input>
          <Input label={t('admin.field_year')}>
            <input type="number" {...register('order')} className="input-base" />
          </Input>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">{t('admin.cancel')}</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">{t('admin.save')}</button>
        </div>
      </form>
    </Modal>
  )
}
