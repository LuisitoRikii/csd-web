import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Trash2, Calendar as CalIcon, Clock, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { appointmentService } from '@/services'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { AdminShell } from '@/components/admin/AdminShell'
import { formatDate } from '@/utils/cn'

export const AdminAppointmentsPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const { data: appts = [] } = useQuery({ queryKey: ['admin-appts'], queryFn: () => appointmentService.list() })

  const updateM = useMutation({ mutationFn: ({ id, data }) => appointmentService.update(id, data), onSuccess: () => qc.invalidateQueries(['admin-appts']) })
  const deleteM = useMutation({ mutationFn: appointmentService.remove, onSuccess: () => { qc.invalidateQueries(['admin-appts']); toast.success(t('admin.delete')) } })

  return (
    <AdminShell subtitle={t('admin.subtitle_studio')} title={t('nav.admin') + ' · ' + t('appointment_page.title')}>
      <div className="p-6 lg:p-12">

        <div className="rounded-3xl bg-paper border border-line overflow-hidden">
          <div className="divide-y divide-line">
            {appts.map((a) => (
              <div key={a.id} className="p-6 flex flex-wrap items-start justify-between gap-4 hover:bg-subtle transition-colors">
                <div className="flex items-start gap-4 flex-1 min-w-[260px]">
                  <div className="w-11 h-11 rounded-full bg-brand text-paper flex items-center justify-center font-medium">
                    {a.first_name?.[0]}{a.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{a.first_name} {a.last_name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-steel mt-1">
                      <span className="flex items-center gap-1"><Mail size={12} /> {a.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {a.phone}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-subtle">
                        <CalIcon size={12} /> {formatDate(a.appointment_date, 'en')}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-subtle">
                        <Clock size={12} /> {a.appointment_time}
                      </span>
                      {a.service_type && <span className="px-2.5 py-1 rounded-full bg-brand/10 text-brand">{a.service_type}</span>}
                    </div>
                    {a.address && <p className="text-xs text-steel mt-2">📍 {a.address}</p>}
                    {a.notes && <p className="text-sm mt-3 italic">"{a.notes}"</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={a.status}
                    onChange={(e) => updateM.mutate({ id: a.id, data: { status: e.target.value } })}
                    className={`text-xs px-3 py-1.5 rounded-full border bg-paper ${
                      a.status === 'pending' ? 'text-charcoal border-line' :
                      a.status === 'accepted' ? 'text-brand border-brand' :
                      'text-steel border-line'
                    }`}
                  >
                    <option value="pending">{t('admin.status_pending')}</option>
                    <option value="accepted">{t('admin.status_accepted')}</option>
                    <option value="cancelled">{t('admin.status_cancelled')}</option>
                    <option value="completed">{t('admin.status_completed')}</option>
                  </select>
                  <button
                    onClick={() => setConfirm(a)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                    aria-label={t('admin.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {appts.length === 0 && (
            <div className="text-center py-20 text-steel">{t('admin.no_appointments')}</div>
          )}
        </div>

        <ConfirmModal
          open={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={() => deleteM.mutate(confirm.id)}
          title={t('admin.delete_appointment_confirm')}
        />
      </div>
    </AdminShell>
  )
}
