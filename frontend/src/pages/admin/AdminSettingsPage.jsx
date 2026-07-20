import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { settingsService } from '@/services'
import { AdminShell } from '@/components/admin/AdminShell'
import { Input } from '@/components/admin/Input'

const GROUP_LABELS = {
  general: 'General',
  contact: 'Contact',
  social: 'Social',
  media: 'Media',
  seo: 'SEO',
}

export const AdminSettingsPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { data: settings = [] } = useQuery({ queryKey: ['admin-settings'], queryFn: () => settingsService.list() })
  const [values, setValues] = useState({})
  const [activeGroup, setActiveGroup] = useState('general')

  useEffect(() => {
    const init = {}
    settings.forEach((s) => { init[s.key] = s.value })
    setValues(init)
  }, [settings])

  const updateM = useMutation({
    mutationFn: settingsService.bulkUpdate,
    onSuccess: () => { qc.invalidateQueries(['admin-settings']); toast.success('Settings saved') },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateM.mutate({ settings: values })
  }

  const groups = ['general', 'contact', 'social', 'media', 'seo']
  const grouped = settings.filter((s) => s.group === activeGroup)

  return (
    <AdminShell subtitle={t('admin.subtitle_studio')} title="Site Settings">
      <div className="p-6 lg:p-12 max-w-5xl">

      <div className="flex gap-2 mb-8 border-b border-line overflow-x-auto">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`px-4 py-2.5 text-sm capitalize border-b-2 transition-colors ${
              activeGroup === g ? 'border-ink text-ink' : 'border-transparent text-steel hover:text-ink'
            }`}
          >
            {GROUP_LABELS[g] || g}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {grouped.map((s) => (
          <div key={s.id} className="rounded-2xl bg-paper border border-line p-5">
            <p className="text-xs text-steel font-mono mb-1">{s.key}</p>
            <p className="text-xs text-steel mb-3">{s.label_en || s.label_es}</p>
            {s.value_type === 'long' || (s.value || '').length > 80 ? (
              <textarea
                value={values[s.key] || ''}
                onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                rows={3}
                className="input-base resize-none"
              />
            ) : (
              <input
                value={values[s.key] || ''}
                onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                className="input-base"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={updateM.isPending}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-paper text-sm"
        >
          <Save size={16} />
          {updateM.isPending ? '…' : t('admin.save')}
        </button>
      </form>
      </div>
    </AdminShell>
  )
}
