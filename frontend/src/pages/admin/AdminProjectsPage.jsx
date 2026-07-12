import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { projectService, categoryService } from '@/services'
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
  images: [],
}

export const AdminProjectsPage = () => {
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

  return (
    <AdminShell
      subtitle="Studio"
      title="Projects"
      actions={
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm"
        >
          <Plus size={16} /> New Project
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
              placeholder="Search projects..."
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
              <div className="relative aspect-[4/3] bg-cream">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-steel">
                    No image
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {p.is_featured && <span className="px-2 py-1 rounded-full bg-amber-500 text-paper text-xs">Featured</span>}
                  {!p.is_published && <span className="px-2 py-1 rounded-full bg-rose-500 text-paper text-xs">Draft</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate text-sm">{p.title_en}</h3>
                <p className="text-xs text-steel truncate mt-1">{p.location} · {p.year}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-steel">{p.view_count || 0} views</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(p); setOpen(true) }} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setConfirm(p)} className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center">
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
        initial={editing ? { ...editing, images: editing.images?.map((i) => i.image_url) || [] } : empty}
        categories={categories}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
      />

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title="Delete project?"
        message={`"${confirm?.title_en}" will be permanently removed.`}
      />
    </AdminShell>
  )
}

const ProjectModal = ({ open, onClose, initial, categories, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial })

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Project' : 'New Project'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Slug" required>
            <input {...register('slug', { required: true })} className="input-base" />
          </Input>
          <Input label="Year">
            <input {...register('year')} className="input-base" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Title (EN)" required><input {...register('title_en', { required: true })} className="input-base" /></Input>
          <Input label="Title (ES)" required><input {...register('title_es', { required: true })} className="input-base" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Description (EN)" required><textarea rows={3} {...register('description_en', { required: true })} className="input-base resize-none" /></Input>
          <Input label="Description (ES)" required><textarea rows={3} {...register('description_es', { required: true })} className="input-base resize-none" /></Input>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Category">
            <select {...register('category_id')} className="input-base">
              <option value="">—</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </Input>
          <Input label="Location"><input {...register('location')} className="input-base" /></Input>
          <Input label="Client"><input {...register('client')} className="input-base" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Duration"><input {...register('duration')} className="input-base" /></Input>
          <Input label="Services used"><input {...register('services_used')} className="input-base" /></Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Long description (EN)"><textarea rows={3} {...register('long_description_en')} className="input-base resize-none" /></Input>
          <Input label="Long description (ES)"><textarea rows={3} {...register('long_description_es')} className="input-base resize-none" /></Input>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Cover image URL"><input {...register('cover_image')} className="input-base" /></Input>
          <Input label="Before image"><input {...register('before_image')} className="input-base" /></Input>
          <Input label="After image"><input {...register('after_image')} className="input-base" /></Input>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_featured')} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_published')} /> Published</label>
          <Input label="Order">
            <input type="number" {...register('order')} className="input-base w-24" />
          </Input>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">Cancel</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">Save</button>
        </div>
      </form>
    </Modal>
  )
}
