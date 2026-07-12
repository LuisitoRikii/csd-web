import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { userService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'
import { useForm } from 'react-hook-form'

const empty = { email: '', full_name: '', role: 'admin', password: '' }

export const AdminUsersPage = () => {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => userService.list() })

  const createM = useMutation({ mutationFn: userService.create, onSuccess: () => { qc.invalidateQueries(['admin-users']); setOpen(false); toast.success('Created') } })
  const updateM = useMutation({ mutationFn: ({ id, data }) => userService.update(id, data), onSuccess: () => { qc.invalidateQueries(['admin-users']); setOpen(false); toast.success('Updated') } })
  const deleteM = useMutation({ mutationFn: userService.remove, onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('Deleted') } })

  return (
    <AdminShell
      subtitle="Studio"
      title="Team"
      actions={
        <button onClick={() => { setEditing(null); setOpen(true) }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm">
          <Plus size={16} /> New User
        </button>
      }
    >
      <div className="p-6 lg:p-12">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="rounded-3xl bg-paper border border-line p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-magenta text-paper font-medium flex items-center justify-center">
              {u.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{u.full_name}</p>
              <p className="text-xs text-steel truncate">{u.email}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(u); setOpen(true) }} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center"><Edit2 size={14} /></button>
              <button onClick={() => setConfirm(u)} className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <UserModal open={open} onClose={() => setOpen(false)} initial={editing || empty}
        onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)} />
      <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteM.mutate(confirm.id)} title="Delete user?" />
      </div>
    </AdminShell>
  )
}

const UserModal = ({ open, onClose, initial, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial })
  useEffect(() => { if (initial) reset(initial) }, [initial, reset])
  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit User' : 'New User'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name"><input {...register('full_name', { required: true })} className="input-base" /></Input>
        <Input label="Email"><input type="email" {...register('email', { required: true })} className="input-base" /></Input>
        <Input label={initial?.id ? 'New password (leave blank to keep)' : 'Password'}>
          <input
            type="password"
            {...register('password', { required: !initial?.id, minLength: 6 })}
            className="input-base"
          />
        </Input>
        <Input label="Role">
          <select {...register('role')} className="input-base">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </Input>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">Cancel</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">Save</button>
        </div>
      </form>
    </Modal>
  )
}
