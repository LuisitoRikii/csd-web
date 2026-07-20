import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Trash2, Mail, Phone, MapPin, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { quoteService } from '@/services'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { AdminShell } from '@/components/admin/AdminShell'
import { formatDate } from '@/utils/cn'

const STATUS_OPTIONS = ['pending', 'contacted', 'approved', 'rejected', 'completed']
const STATUS_KEY_MAP = {
  pending: 'status_pending',
  contacted: 'status_contacted',
  approved: 'status_approved',
  rejected: 'status_rejected',
  completed: 'status_completed',
}

export const AdminQuotesPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: quotes = [] } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: () => quoteService.list(),
  })

  const updateM = useMutation({
    mutationFn: ({ id, data }) => quoteService.update(id, data),
    onSuccess: () => qc.invalidateQueries(['admin-quotes']),
  })
  const deleteM = useMutation({
    mutationFn: quoteService.remove,
    onSuccess: () => { qc.invalidateQueries(['admin-quotes']); toast.success(t('admin.delete')) },
  })

  const filtered = quotes.filter((q) => {
    const matchesSearch = `${q.first_name} ${q.last_name} ${q.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminShell subtitle={t('admin.subtitle_studio')} title={t('admin.recent_quotes')}>
      <div className="p-6 lg:p-12">

      <div className="rounded-3xl bg-paper border border-line overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-line">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <Search size={16} className="text-steel" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.search_projects')}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-line bg-paper text-sm"
          >
            <option value="all">{t('common.previous')} · {t('common.next')}</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{t(`admin.${STATUS_KEY_MAP[s]}`)}</option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-line">
          {filtered.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="p-6 hover:bg-subtle transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-[260px]">
                    <div className="w-11 h-11 rounded-full bg-brand text-paper flex items-center justify-center font-medium">
                    {q.first_name?.[0]}{q.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{q.first_name} {q.last_name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-steel mt-1">
                      <span className="flex items-center gap-1"><Mail size={12} /> {q.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {q.phone}</span>
                      {q.address && <span className="flex items-center gap-1"><MapPin size={12} /> {q.address}</span>}
                    </div>
                    <div className="mt-3 p-3 rounded-2xl bg-subtle text-sm text-charcoal">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-steel mb-1">{q.service_name || t('quote_page.service')}</p>
                      {q.description}
                    </div>
                    {q.images?.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {q.images.slice(0, 4).map((img) => (
                          <a key={img.id} href={img.image_url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden">
                            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-steel">{formatDate(q.created_at, 'en')}</span>
                  <select
                    value={q.status}
                    onChange={(e) => updateM.mutate({ id: q.id, data: { status: e.target.value } })}
                    className={`text-xs px-3 py-1.5 rounded-full border bg-paper ${
                      q.status === 'pending' ? 'text-charcoal border-line' :
                      q.status === 'approved' ? 'text-brand border-brand' :
                      q.status === 'completed' ? 'text-brand border-brand' :
                      q.status === 'rejected' ? 'text-steel border-line' :
                      'border-line text-ink'
                    }`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{t(`admin.${STATUS_KEY_MAP[s]}`)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setConfirm(q)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center"
                    aria-label={t('admin.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-steel">{t('admin.no_messages')}</div>
        )}
      </div>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => deleteM.mutate(confirm.id)}
        title={t('admin.delete_quote_confirm')}
      />
      </div>
    </AdminShell>
  )
}
