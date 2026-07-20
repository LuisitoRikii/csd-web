import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Briefcase, ImageIcon, FileText, Calendar, MessageSquare,
  Users, ArrowUpRight, Sparkles, BookOpen, Mail, Bell, HardDrive,
} from 'lucide-react'
import { dashboardService, filesService } from '@/services'
import { AdminShell } from '@/components/admin/AdminShell'

const cardKeys = [
  { key: 'projects',     icon: ImageIcon,     to: '/admin/projects' },
  { key: 'services',     icon: Briefcase,     to: '/admin/services' },
  { key: 'blog',         icon: BookOpen,      to: '/admin/blog' },
  { key: 'quotes',       icon: FileText,      to: '/admin/quotes',       pendingKey: 'pending_quotes' },
  { key: 'appointments', icon: Calendar,      to: '/admin/appointments', pendingKey: 'pending_appointments' },
  { key: 'messages',     icon: MessageSquare, to: '/admin/messages',     pendingKey: 'unread_messages' },
  { key: 'team',         icon: Users,         to: '/admin/users' },
]

const cardColors = [
  'from-mint to-violet',
  'from-violet to-magenta',
  'from-magenta to-ink',
  'from-steel to-charcoal',
  'from-charcoal to-graphite',
  'from-mint to-violet',
  'from-violet to-magenta',
]

const Sparkline = ({ data, color = '#8A04F0', height = 60 }) => {
  if (!data?.length) return <div className="h-[60px] flex items-center justify-center text-xs text-steel/60">No data</div>
  const values = data.map((d) => d.count)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const width = 200
  const step = data.length > 1 ? width / (data.length - 1) : width

  const points = values.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * (height - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const path = `M ${points.join(' L ')}`
  const area = `${path} L ${width},${height} L 0,${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const StatusBar = ({ items, total }) => {
  if (!total) return null
  return (
    <div className="space-y-2.5">
      {items.map((it) => {
        const pct = total ? (it.count / total) * 100 : 0
        const colors = {
          pending:   'bg-amber-400',
          approved:  'bg-violet',
          rejected:  'bg-red-400',
          completed: 'bg-mint',
          cancelled: 'bg-steel',
          contact_requested: 'bg-blue-400',
          accepted: 'bg-violet',
        }
        return (
          <div key={it.status} className="flex items-center gap-3">
            <span className="text-xs text-charcoal w-24 capitalize">{it.status.replace('_', ' ')}</span>
            <div className="flex-1 h-2 rounded-full bg-subtle overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${colors[it.status] || 'bg-violet'}`}
              />
            </div>
            <span className="text-xs text-steel tabular-nums w-8 text-right">{it.count}</span>
          </div>
        )
      })}
    </div>
  )
}

export const AdminDashboardPage = () => {
  const { t } = useTranslation()
  const [windowDays, setWindowDays] = useState(30)

  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => dashboardService.stats() })
  const { data: recent } = useQuery({ queryKey: ['dashboard-recent'], queryFn: () => dashboardService.recent() })
  const { data: charts } = useQuery({
    queryKey: ['dashboard-charts', windowDays],
    queryFn: () => dashboardService.charts(windowDays),
  })
  const { data: usage } = useQuery({
    queryKey: ['admin-files-usage'],
    queryFn: () => filesService.diskUsage(),
    staleTime: 60_000,
  })

  const cards = cardKeys.map((c, i) => ({
    ...c,
    label: t(`admin.card_${c.key}`),
    color: cardColors[i],
    value: stats?.[
      c.key === 'blog' ? 'total_blog_posts' :
      c.key === 'team' ? 'total_clients' :
      `total_${c.key}`
    ],
    pending: c.pendingKey && stats?.[c.pendingKey] != null
      ? { value: stats[c.pendingKey], key: c.pendingKey }
      : null,
  }))

  const totalQuotes = useMemo(
    () => (charts?.quote_status || []).reduce((s, x) => s + x.count, 0),
    [charts]
  )

  return (
    <AdminShell subtitle={t('admin.subtitle_studio')} title={`${t('admin.welcome_heading')} ✨`}>
      <div className="p-6 lg:p-12">
        <p className="text-charcoal/70 mb-10">{t('admin.welcome_subheading')}</p>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <Link
                  to={c.to}
                  className="block relative rounded-3xl p-6 bg-paper border border-line hover:border-violet/30 hover:shadow-soft transition-all overflow-hidden group"
                >
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-15 blur-2xl bg-gradient-to-br ${c.color}`} />
                  <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${c.color} text-paper`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xs text-steel uppercase tracking-wider mb-1">{c.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="font-serif text-4xl tracking-tight">{c.value ?? '—'}</p>
                    <ArrowUpRight size={16} className="text-steel group-hover:text-violet group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  {c.pending && c.pending.value > 0 && (
                    <p className="text-xs text-violet mt-2 inline-flex items-center gap-1">
                      <Bell size={10} /> {c.pending.value} {t('admin.pending_suffix')}
                    </p>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Charts panel */}
        <div className="rounded-3xl bg-paper border border-line p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="font-serif text-2xl tracking-tight">{t('admin.charts_title')}</h3>
              <p className="text-xs text-steel mt-1">
                {t('admin.charts_window', { days: windowDays })}
              </p>
            </div>
            <div className="inline-flex rounded-full bg-subtle border border-line p-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setWindowDays(d)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    windowDays === d ? 'bg-ink text-paper' : 'text-steel hover:text-ink'
                  }`}
                >
                  {t(`admin.charts_window_${d}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-xs text-steel uppercase tracking-[0.18em] font-semibold mb-3">
                {t('admin.charts_quotes')}
              </p>
              <Sparkline data={charts?.quotes_by_day || []} color="#8A04F0" height={70} />
            </div>
            <div>
              <p className="text-xs text-steel uppercase tracking-[0.18em] font-semibold mb-3">
                {t('admin.charts_messages')}
              </p>
              <Sparkline data={charts?.messages_by_day || []} color="#D925A9" height={70} />
            </div>
            <div>
              <p className="text-xs text-steel uppercase tracking-[0.18em] font-semibold mb-3">
                {t('admin.charts_appointments')}
              </p>
              <Sparkline data={charts?.appointments_by_day || []} color="#91F2D7" height={70} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-line">
            <div>
              <p className="text-xs text-steel uppercase tracking-[0.18em] font-semibold mb-4">
                {t('admin.charts_top_services')}
              </p>
              {(charts?.top_services || []).length > 0 ? (
                <div className="space-y-2.5">
                  {charts.top_services.map((s, i) => {
                    const max = charts.top_services[0]?.count || 1
                    const pct = (s.count / max) * 100
                    return (
                      <div key={s.name} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-steel w-5 tabular-nums">#{i + 1}</span>
                        <span className="text-sm text-ink truncate flex-1 min-w-0">{s.name}</span>
                        <div className="w-32 h-2 rounded-full bg-subtle overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                            className="h-full rounded-full bg-gradient-spectrum"
                          />
                        </div>
                        <span className="text-xs text-steel tabular-nums w-8 text-right">{s.count}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-steel/70">{t('admin.charts_no_data')}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-steel uppercase tracking-[0.18em] font-semibold mb-4">
                {t('admin.charts_quote_status')}
              </p>
              {(charts?.quote_status || []).length > 0 ? (
                <StatusBar items={charts.quote_status} total={totalQuotes} />
              ) : (
                <p className="text-xs text-steel/70">{t('admin.charts_no_data')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent activity + storage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl bg-paper border border-line p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                <HardDrive size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-steel font-semibold">
                  {t('admin.files_disk_usage')}
                </p>
                <p className="font-serif text-2xl tracking-tight">{usage?.total_human || '—'}</p>
              </div>
            </div>
            {usage && (
              <div className="text-xs text-steel space-y-1">
                <p>{usage.file_count} files · {usage.folder_count} folders</p>
              </div>
            )}
            <Link
              to="/admin/files"
              className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-violet hover:text-magenta transition-colors"
            >
              Open file manager <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="rounded-3xl bg-paper border border-line p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-2xl tracking-tight">{t('admin.recent_quotes')}</h3>
              <Link to="/admin/quotes" className="text-xs text-violet flex items-center gap-1">
                {t('common.next')} <ArrowUpRight size={12} />
              </Link>
            </div>
            {recent?.quotes?.length ? (
              <div className="space-y-2">
                {recent.quotes.map((q) => (
                  <div key={q.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-subtle transition-colors">
                    <div className="w-9 h-9 rounded-full bg-violet text-paper text-sm font-medium flex items-center justify-center">
                      {q.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{q.name}</p>
                      <p className="text-xs text-steel truncate">
                        {q.service_name || q.email}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-1 rounded-full ${
                      q.status === 'pending' ? 'text-amber-700 bg-amber-50' :
                      q.status === 'approved' ? 'text-violet bg-violet/10' :
                      q.status === 'completed' ? 'text-emerald-700 bg-emerald-50' :
                      'text-steel bg-subtle'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : <EmptyState />}
          </div>

          <div className="rounded-3xl bg-paper border border-line p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-2xl tracking-tight">{t('admin.recent_messages')}</h3>
              <Link to="/admin/messages" className="text-xs text-violet flex items-center gap-1">
                {t('common.next')} <ArrowUpRight size={12} />
              </Link>
            </div>
            {recent?.messages?.length ? (
              <div className="space-y-2">
                {recent.messages.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-subtle transition-colors">
                    <div className="w-9 h-9 rounded-full bg-magenta/15 text-magenta text-sm font-medium flex items-center justify-center">
                      <Mail size={14} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-steel truncate">{m.subject || t('admin.no_subject')}</p>
                    </div>
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-violet" aria-label="Unread" />}
                  </div>
                ))}
              </div>
            ) : <EmptyState />}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

const EmptyState = () => {
  const { t } = useTranslation()
  return (
    <div className="text-center py-10">
      <Sparkles className="mx-auto text-steel mb-3" size={28} />
      <p className="text-sm text-steel">{t('admin.no_activity')}</p>
    </div>
  )
}
