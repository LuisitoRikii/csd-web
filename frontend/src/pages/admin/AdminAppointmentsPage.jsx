import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Calendar as CalIcon, Clock, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { appointmentService } from '@/services'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { AdminShell } from '@/components/admin/AdminShell'
import { formatDate } from '@/utils/cn'

export const AdminAppointmentsPage = () => {
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const { data: appts = [] } = useQuery({ queryKey: ['admin-appts'], queryFn: () => appointmentService.list() })

  const updateM = useMutation({ mutationFn: ({ id, data }) => appointmentService.update(id, data), onSuccess: () => qc.invalidateQueries(['admin-appts']) })
  const deleteM = useMutation({ mutationFn: appointmentService.remove, onSuccess: () => { qc.invalidateQueries(['admin-appts']); toast.success('Deleted') } })

  return (
    <AdminShell subtitle="Studio" title="Appointments">
      <div className="p-6 lg:p-12">

      <div className="rounded-3xl bg-paper border border-line overflow-hidden">
        <div className="divide-y divide-line">
          {appts.map((a) => (
            <div key={a.id} className="p-6 flex flex-wrap items-start justify-between gap-4 hover:bg-cream/60 transition-colors">
              <div className="flex items-start gap-4 flex-1 min-w-[260px]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet to-magenta text-paper flex items-center justify-center font-medium">
                  {a.first_name[0]}{a.last_name[0]}
                </div>
                <div>
                  <p className="font-medium">{a.first_name} {a.last_name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-steel mt-1">
                    <span className="flex items-center gap-1"><Mail size={12} /> {a.email}</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {a.phone}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream"><CalIcon size={12} /> {formatDate(a.appointment_date, 'en')}</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream"><Clock size={12} /> {a.appointment_time}</span>
                    {a.service_type && <span className="px-2.5 py-1 rounded-full bg-cyan/10 text-cyan">{a.service_type}</span>}
                  </div>
                  {a.address && <p className="text-xs text-steel mt-2">📍 {a.address}</p>}
                  {a.notes && <p className="text-sm mt-3 italic">"{a.notes}"</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select
                  value={a.status}
                  onChange={(e) => updateM.mutate({ id: a.id, data: { status: e.target.value } })}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    a.status === 'pending' ? 'border-amber-300 bg-amber-50 text-amber-700' :
                    a.status === 'accepted' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                    'border-rose-300 bg-rose-50 text-rose-700'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => setConfirm(a)}
                  className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {appts.length === 0 && <div className="text-center py-20 text-steel">No appointments</div>}
      </div>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title="Delete appointment?"
      />
      </div>
    </AdminShell>
  )
}
