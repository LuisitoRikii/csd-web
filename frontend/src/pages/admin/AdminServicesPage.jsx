import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { serviceService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
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
  color: '#06B6D4',
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

  const filtered = services.filter((s) => s.title_en?.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminShell
      subtitle="Studio"
      title="Services"
      actions={
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm"
        >
          <Plus size={16} /> New Service
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
            placeholder="Search services..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="divide-y divide-line">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-4 p-5 hover:bg-cream/60 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                <span className="font-mono text-xs">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.title_en}</p>
                <p className="text-xs text-steel truncate">{s.description_en}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {s.is_active ? 'Active' : 'Inactive'}
              </span>
              {s.is_featured && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
              )}
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditing(s); setOpen(true) }}
                  className="w-9 h-9 rounded-full hover:bg-cream flex items-center justify-center"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setConfirm(s)}
                  className="w-9 h-9 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
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
        title="Delete service?"
        message={`"${confirm?.title_en}" will be permanently removed.`}
      />
      </div>
    </AdminShell>
  )
}

const ServiceModal = ({ open, onClose, initial, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial })
  useEffect(() => { if (initial) reset(initial) }, [initial, reset])
  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Service' : 'New Service'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Slug">
            <input {...register('slug', { required: true })} className="input-base" placeholder="mural-art" />
          </Input>
          <Input label="Color">
            <input type="color" {...register('color')} className="input-base h-12" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Title (EN)">
            <input {...register('title_en', { required: true })} className="input-base" />
          </Input>
          <Input label="Title (ES)">
            <input {...register('title_es', { required: true })} className="input-base" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Description (EN)">
            <textarea rows={3} {...register('description_en', { required: true })} className="input-base resize-none" />
          </Input>
          <Input label="Description (ES)">
            <textarea rows={3} {...register('description_es', { required: true })} className="input-base resize-none" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Long description (EN)">
            <textarea rows={3} {...register('long_description_en')} className="input-base resize-none" />
          </Input>
          <Input label="Long description (ES)">
            <textarea rows={3} {...register('long_description_es')} className="input-base resize-none" />
          </Input>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Icon">
            <input {...register('icon')} className="input-base" placeholder="Brush" />
          </Input>
          <Input label="Order">
            <input type="number" {...register('order')} className="input-base" />
          </Input>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('is_featured')} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('is_active')} /> Active
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">Cancel</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">Save</button>
        </div>
      </form>
    </Modal>
  )
}
