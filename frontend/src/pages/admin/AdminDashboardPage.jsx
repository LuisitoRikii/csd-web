import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Briefcase, ImageIcon, FileText, Calendar, MessageSquare,
  Users, ArrowUpRight, Sparkles, BookOpen,
} from 'lucide-react'
import { dashboardService } from '@/services'
import { AdminShell } from '@/components/admin/AdminShell'

export const AdminDashboardPage = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.stats(),
  })
  const { data: recent } = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: () => dashboardService.recent(),
  })

  const cards = [
    { label: 'Projects', value: stats?.total_projects, icon: ImageIcon, color: 'from-cyan to-blue-500', to: '/admin/projects' },
    { label: 'Services', value: stats?.total_services, icon: Briefcase, color: 'from-violet to-purple-500', to: '/admin/services' },
    { label: 'Blog Posts', value: stats?.total_blog_posts, icon: BookOpen, color: 'from-magenta to-pink-500', to: '/admin/blog' },
    { label: 'Quotes', value: stats?.total_quotes, icon: FileText, color: 'from-amber-500 to-orange-500', to: '/admin/quotes', extra: `${stats?.pending_quotes || 0} pending` },
    { label: 'Appointments', value: stats?.total_appointments, icon: Calendar, color: 'from-emerald-500 to-teal-500', to: '/admin/appointments', extra: `${stats?.pending_appointments || 0} pending` },
    { label: 'Messages', value: stats?.total_messages, icon: MessageSquare, color: 'from-rose-500 to-red-500', to: '/admin/messages' },
    { label: 'Team', value: stats?.total_clients, icon: Users, color: 'from-fuchsia-500 to-pink-600', to: '/admin/users' },
  ]

  return (
    <AdminShell subtitle="Admin · Studio" title="Welcome back ✨">
      <div className="p-6 lg:p-12">
        <p className="text-charcoal/70 mb-10">Here's what's happening at the studio today.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <Link
                  to={c.to}
                  className="block relative rounded-3xl p-6 bg-paper border border-line hover:border-ink/30 hover:shadow-soft transition-all overflow-hidden group"
                >
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-15 blur-2xl bg-gradient-to-br ${c.color}`} />
                  <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${c.color} text-paper`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xs text-steel uppercase tracking-wider mb-1">{c.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="font-serif text-4xl tracking-tight">{c.value ?? '—'}</p>
                    <ArrowUpRight size={16} className="text-steel group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  {c.extra && <p className="text-xs text-cyan mt-2">{c.extra}</p>}
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-paper border border-line p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-2xl tracking-tight">Recent quotes</h3>
              <Link to="/admin/quotes" className="text-xs text-cyan flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            {recent?.quotes?.length ? (
              <div className="space-y-2">
                {recent.quotes.map((q) => (
                  <div key={q.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-paper text-sm font-medium">
                      {q.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{q.name}</p>
                      <p className="text-xs text-steel">{new Date(q.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      q.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      q.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
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
              <h3 className="font-serif text-2xl tracking-tight">Recent messages</h3>
              <Link to="/admin/messages" className="text-xs text-cyan flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            {recent?.messages?.length ? (
              <div className="space-y-2">
                {recent.messages.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-paper text-sm font-medium">
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-steel truncate">{m.subject || 'No subject'}</p>
                    </div>
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-cyan" />}
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

const EmptyState = () => (
  <div className="text-center py-10">
    <Sparkles className="mx-auto text-steel mb-3" size={28} />
    <p className="text-sm text-steel">No recent activity</p>
  </div>
)
