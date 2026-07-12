import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Mail, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { contactService } from '@/services'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { AdminShell } from '@/components/admin/AdminShell'
import { formatDate } from '@/utils/cn'

export const AdminMessagesPage = () => {
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const { data: msgs = [] } = useQuery({ queryKey: ['admin-msgs'], queryFn: () => contactService.list() })

  const markRead = useMutation({ mutationFn: contactService.markRead, onSuccess: () => qc.invalidateQueries(['admin-msgs']) })
  const deleteM = useMutation({ mutationFn: contactService.remove, onSuccess: () => { qc.invalidateQueries(['admin-msgs']); toast.success('Deleted') } })

  return (
    <AdminShell subtitle="Studio" title="Messages">
      <div className="p-6 lg:p-12">

      <div className="rounded-3xl bg-paper border border-line divide-y divide-line">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`p-6 hover:bg-cream/60 transition-colors ${!m.is_read ? 'bg-cyan/[0.03]' : ''}`}
            onClick={() => !m.is_read && markRead.mutate(m.id)}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-[260px]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-paper text-sm font-medium">
                  {m.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{m.name}</p>
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-cyan" />}
                  </div>
                  <p className="text-xs text-steel flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Mail size={11} /> {m.email}</span>
                    {m.phone && <span>{m.phone}</span>}
                    {m.subject && <>· <span className="italic">"{m.subject}"</span></>}
                  </p>
                  <p className="text-sm mt-3 text-charcoal">{m.message}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-steel">{formatDate(m.created_at, 'en')}</span>
                <button onClick={(e) => { e.stopPropagation(); setConfirm(m) }} className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {msgs.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto text-steel mb-3" size={28} />
            <p className="text-sm text-steel">No messages</p>
          </div>
        )}
      </div>

      <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteM.mutate(confirm.id)} title="Delete message?" />
      </div>
    </AdminShell>
  )
}
