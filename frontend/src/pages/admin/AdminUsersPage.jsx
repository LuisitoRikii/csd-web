import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, KeyRound, Eye, EyeOff, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { userService } from '@/services'
import { Modal } from '@/components/admin/Modal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Input } from '@/components/admin/Input'
import { AdminShell } from '@/components/admin/AdminShell'

const empty = { email: '', full_name: '', role: 'admin', password: '' }

export const AdminUsersPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [resetTarget, setResetTarget] = useState(null)

  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => userService.list() })

  const createM = useMutation({
    mutationFn: userService.create,
    onSuccess: () => { qc.invalidateQueries(['admin-users']); setOpen(false); toast.success('Created') },
  })
  const updateM = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); setOpen(false); toast.success('Updated') },
  })
  const deleteM = useMutation({
    mutationFn: userService.remove,
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('Deleted') },
  })
  const resetM = useMutation({
    mutationFn: ({ id, newPassword }) => userService.resetPassword(id, newPassword),
    onSuccess: () => { setResetTarget(null); toast.success(t('admin.password_changed')) },
  })

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('admin.card_team')}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div key={u.id} className="rounded-3xl bg-paper border border-line p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-violet text-paper font-medium flex items-center justify-center shrink-0">
                {u.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.full_name}</p>
                <p className="text-xs text-steel truncate">{u.email}</p>
                <span className="text-[10px] uppercase tracking-[0.18em] text-steel font-semibold">
                  {u.role || 'admin'}
                </span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setResetTarget(u)}
                  className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center text-charcoal"
                  aria-label={t('admin.reset_password')}
                  title={t('admin.reset_password')}
                >
                  <KeyRound size={14} />
                </button>
                <button
                  onClick={() => { setEditing(u); setOpen(true) }}
                  className="w-8 h-8 rounded-full hover:bg-subtle flex items-center justify-center"
                  aria-label={t('admin.edit')}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setConfirm(u)}
                  className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                  aria-label={t('admin.delete')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <UserModal
          open={open}
          onClose={() => setOpen(false)}
          initial={editing || empty}
          onSubmit={(data) => editing ? updateM.mutate({ id: editing.id, data }) : createM.mutate(data)}
        />

        <ConfirmModal
          open={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={() => deleteM.mutate(confirm.id)}
          title={t('admin.delete_user_confirm')}
        />

        <ResetPasswordModal
          open={!!resetTarget}
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onSubmit={(newPassword) => resetM.mutate({ id: resetTarget.id, newPassword })}
          pending={resetM.isPending}
        />
      </div>
    </AdminShell>
  )
}

const UserModal = ({ open, onClose, initial, onSubmit }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial })
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => { if (initial) reset(initial); setShowPwd(false) }, [initial, reset])

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? t('admin.edit') : t('admin.new')} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name">
          <input {...register('full_name', { required: true })} className="input-base" />
        </Input>
        <Input label={t('admin.login_email_label')}>
          <input type="email" {...register('email', { required: true })} className="input-base" />
        </Input>
        <Input label={initial?.id ? 'New password (leave blank to keep)' : t('admin.login_password_label')}>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" aria-hidden="true" />
            <input
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password', { required: !initial?.id, minLength: 6 })}
              className="input-base pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink"
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Input>
        <Input label="Role">
          <select {...register('role')} className="input-base">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </Input>
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">{t('admin.cancel')}</button>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm">{t('admin.save')}</button>
        </div>
      </form>
    </Modal>
  )
}

const ResetPasswordModal = ({ open, user, onClose, onSubmit, pending }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { new_password: '', confirm_password: '' },
    mode: 'onTouched',
  })
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => { if (!open) reset() }, [open, reset])

  if (!user) return null

  return (
    <Modal open={open} onClose={onClose} title={t('admin.reset_password')} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-subtle border border-line mb-2">
          <KeyRound size={16} className="text-violet shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-steel truncate">{user.email}</p>
          </div>
        </div>

        <Input label={t('admin.new_password')} error={errors.new_password?.type === 'minLength' ? { type: 'minLength' } : errors.new_password} required>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" aria-hidden="true" />
            <input
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('new_password', { required: true, minLength: 6 })}
              className="input-base pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink"
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Input>

        <Input
          label={t('admin.confirm_password')}
          error={errors.confirm_password?.type === 'validate' ? { type: 'mismatch' } : errors.confirm_password}
          required
        >
          <input
            type="password"
            autoComplete="new-password"
            {...register('confirm_password', {
              required: true,
              validate: (v) => v === watch('new_password') || 'mismatch',
            })}
            className="input-base"
          />
        </Input>

        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-sm">{t('admin.cancel')}</button>
          <button type="submit" disabled={pending} className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm disabled:opacity-50">
            {t('admin.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
