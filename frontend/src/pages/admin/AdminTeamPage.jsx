import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { teamService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { AdminShell } from '@/components/admin/AdminShell'
import { useForm } from 'react-hook-form'

const empty = {
  name: '',
  role_en: '',
  role_es: '',
  bio_en: '',
  bio_es: '',
  photo_url: '',
  is_active: true,
  order: 0,
}

export const AdminTeamPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const { data: members = [] } = useQuery({
    queryKey: ['admin-team'],
    queryFn: () => teamService.list({ limit: 100 }),
  })

  const createM = useMutation({
    mutationFn: teamService.create,
    onSuccess: () => { qc.invalidateQueries(['admin-team']); setOpen(false); toast.success('Created') },
  })
  const updateM = useMutation({
    mutationFn: ({ id, data }) => teamService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-team']); setOpen(false); toast.success('Updated') },
  })
  const deleteM = useMutation({
    mutationFn: teamService.remove,
    onSuccess: () => { qc.invalidateQueries(['admin-team']); toast.success('Deleted') },
  })

  const filtered = members.filter((m) =>
    [m.name, m.role_en, m.role_es].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title="Team"
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
              placeholder="Search team…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-line border-dashed p-12 lg:p-20 text-center text-steel">
            <Users size={32} className="mx-auto mb-4" />
            <p className="text-sm">No team members yet. Add the first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((member, i) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group rounded-3xl bg-paper border border-line overflow-hidden hover:border-ink/30 transition-all ${member.is_active ? '' : 'opacity-60'}`}
              >
                <div className="relative aspect-[4/5] bg-subtle">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-steel">
                      <Users size={28} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditing(member); setOpen(true) }}
                      className="w-8 h-8 rounded-full bg-paper text-ink flex items-center justify-center"
                      aria-label={t('admin.edit')}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirm(member)}
                      className="w-8 h-8 rounded-full bg-paper text-red-600 flex items-center justify-center"
                      aria-label={t('admin.delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate">{member.name}</h3>
                  <p className="text-xs text-steel truncate mt-1">{member.role_en}</p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <TeamModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing || empty}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
      />

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title="Delete this team member?"
      />
    </AdminShell>
  )
}

const TeamModal = ({ open, onClose, initial, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: initial })

  useEffect(() => { reset(initial) }, [initial, reset])

  const submit = (data) => onSubmit({
    ...data,
    order: Number(data.order) || 0,
  })

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? t('admin.edit') : t('admin.new')} size="lg">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" required>
            <input {...register('name', { required: true })} className="input-base" />
          </Input>
          <Input label="Order">
            <input type="number" {...register('order', { valueAsNumber: true })} className="input-base" />
          </Input>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Role (EN)">
            <input {...register('role_en')} className="input-base" placeholder="Founder · Lead muralist" />
          </Input>
          <Input label="Role (ES)">
            <input {...register('role_es')} className="input-base" placeholder="Fundador · Muralista principal" />
          </Input>
        </div>
        <Input label="Photo">
          <ImageUploader
            value={watch('photo_url') ? [watch('photo_url')] : []}
            onChange={(urls) => setValue('photo_url', urls[0] || '', { shouldDirty: true })}
            multiple={false}
            maxFiles={1}
            folder="team"
          />
        </Input>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Bio (EN)">
            <textarea rows={3} {...register('bio_en')} className="input-base resize-y" />
          </Input>
          <Input label="Bio (ES)">
            <textarea rows={3} {...register('bio_es')} className="input-base resize-y" />
          </Input>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('is_active')} /> Active (visible on the site)
        </label>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">{t('admin.cancel')}</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">{t('admin.save')}</button>
        </div>
      </form>
    </Modal>
  )
}