import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/admin/Modal'
import { Input } from '@/components/admin/Input'
import { authService } from '@/services'

/**
 * ChangePasswordModal — used by the logged-in user to change their own
 * password. Requires the current password and a new password (min 6 chars)
 * with confirmation.
 *
 * Props:
 *   open     — controls visibility
 *   onClose  — close handler
 */
export const ChangePasswordModal = ({ open, onClose }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
    mode: 'onTouched',
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => { if (!open) reset() }, [open, reset])

  const onSubmit = async (data) => {
    try {
      await authService.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      })
      toast.success(t('admin.password_changed'))
      reset()
      onClose?.()
    } catch (e) {
      const status = e?.response?.status
      if (status === 400) {
        toast.error(t('admin.password_wrong'))
      } else {
        toast.error(t('common.error'))
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('admin.change_password')} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-subtle border border-line mb-2">
          <KeyRound size={16} className="text-violet shrink-0" aria-hidden="true" />
          <p className="text-xs text-charcoal/80 leading-relaxed">
            {t('admin.change_password')}
          </p>
        </div>

        <Input label={t('admin.current_password')} error={errors.current_password} required>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" aria-hidden="true" />
            <input
              type={showCurrent ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('current_password', { required: true })}
              className="input-base pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Input>

        <Input
          label={t('admin.new_password')}
          error={
            errors.new_password?.type === 'minLength'
              ? { type: 'minLength' }
              : errors.new_password
          }
          required
        >
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" aria-hidden="true" />
            <input
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('new_password', { required: true, minLength: 6 })}
              className="input-base pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Input>

        <Input
          label={t('admin.confirm_password')}
          error={
            errors.confirm_password?.type === 'validate'
              ? { type: 'mismatch' }
              : errors.confirm_password
          }
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
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-line text-sm hover:bg-subtle transition-colors"
          >
            {t('admin.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-ink text-paper text-sm disabled:opacity-50"
          >
            {t('admin.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
