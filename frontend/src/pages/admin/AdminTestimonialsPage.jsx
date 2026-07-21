import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { testimonialService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
import { useForm } from 'react-hook-form'

const empty = {
  author: '',
  role: '',
  body: '',
  rating: 5,
  is_active: true,
  order: 0,
}

export const AdminTestimonialsPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const { data: items = [] } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => testimonialService.list({ limit: 100 }),
  })

  const createM = useMutation({
    mutationFn: testimonialService.create,
    onSuccess: () => { qc.invalidateQueries(['admin-testimonials']); setOpen(false); toast.success('Created') },
  })
  const updateM = useMutation({
    mutationFn: ({ id, data }) => testimonialService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-testimonials']); setOpen(false); toast.success('Updated') },
  })
  const deleteM = useMutation({
    mutationFn: testimonialService.remove,
    onSuccess: () => { qc.invalidateQueries(['admin-testimonials']); toast.success('Deleted') },
  })

  const filtered = items.filter((it) =>
    [it.author, it.role, it.body].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('testimonials.title_l1') || 'Testimonials'}
      actions={
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm"
        >
          <Plus size={16} /> {t('admin.new')}
        </button>
      }
    >
      <div className="p-6 lg:p-12">
        <div className="rounded-3xl bg-paper border border-line overflow-hidden mb-6">
          <div className="p-5 flex items-center gap-3">
            <Search size={16} className="text-steel" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search testimonials…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it, i) => (
            <motion.article
              key={it.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`group rounded-3xl bg-paper border border-line p-6 flex flex-col gap-4 ${it.is_active ? '' : 'opacity-60'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-magenta">
                  {[...Array(Math.max(0, Math.min(5, it.rating || 0)))].map((_, j) => (
                    <Star key={j} size={14} className="fill-current" />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(it); setOpen(true) }}
                    className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center"
                    aria-label={t('admin.edit')}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setConfirm(it)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                    aria-label={t('admin.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <blockquote className="font-serif text-base leading-snug text-charcoal flex-1">
                &ldquo;{it.body}&rdquo;
              </blockquote>
              <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-ink">{it.author}</p>
                  {it.role && <p className="text-steel uppercase tracking-wide mt-0.5">{it.role}</p>}
                </div>
                {!it.is_active && (
                  <span className="px-2 py-0.5 rounded-full bg-paper text-steel text-[10px] border border-line">
                    {t('admin.badge_draft') || 'Draft'}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <TestimonialModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing || empty}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
      />

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title="Delete this testimonial?"
      />
    </AdminShell>
  )
}

const TestimonialModal = ({ open, onClose, initial, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, watch, setValue } = useForm({ defaultValues: initial })

  useEffect(() => { reset(initial) }, [initial, reset])

  const submit = (data) => onSubmit({
    ...data,
    rating: Number(data.rating) || 5,
    order: Number(data.order) || 0,
  })

  const rating = Number(watch('rating') || 5)

  return (
    <Modal open={onClose === undefined ? false : open} onClose={onClose} title={initial?.id ? t('admin.edit') : t('admin.new')} size="md">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input label={t('admin.field_author') || 'Author'} required>
          <input {...register('author', { required: true })} className="input-base" />
        </Input>
        <Input label="Role / company">
          <input {...register('role')} className="input-base" placeholder="Homeowner · Pinecrest" />
        </Input>
        <Input label={t('admin.field_body') || 'Body'} required>
          <textarea rows={5} {...register('body', { required: true })} className="input-base resize-y" />
        </Input>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Rating">
            <select {...register('rating', { valueAsNumber: true })} className="input-base">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'star' : 'stars'}</option>
              ))}
            </select>
          </Input>
          <Input label="Order">
            <input type="number" {...register('order', { valueAsNumber: true })} className="input-base" />
          </Input>
        </div>
        <div className="flex gap-0.5 text-magenta">
          {[...Array(5)].map((_, j) => (
            <button
              key={j}
              type="button"
              onClick={() => setValue('rating', j + 1, { shouldDirty: true })}
              className="p-0.5"
              aria-label={`${j + 1} stars`}
            >
              <Star size={20} className={j < rating ? 'fill-current' : 'text-line'} />
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('is_active')} /> Active (visible on the home)
        </label>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">{t('admin.cancel')}</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">{t('admin.save')}</button>
        </div>
      </form>
    </Modal>
  )
}