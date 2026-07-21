import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { settingsService } from '@/services'
import { AdminShell } from '@/components/admin/AdminShell'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { BeforeAfterEditor, HomeVideosEditor } from '@/components/admin/MediaSettingsEditors'

const GROUP_LABELS = {
  general: 'General',
  contact: 'Contact',
  social: 'Social',
  media: 'Media',
  seo: 'SEO',
}

const IMAGE_SETTINGS = new Set([
  'hero_image_url',
  'hero_image_fallback_url',
  'about_image_url',
  'about_image_fallback_url',
  'about_story_image_url',
  'about_team_image_url',
  'quote_hero_image_url',
])

const SettingControl = ({ setting, value, onChange, onUploadingChange, disabled }) => {
  if (setting.key === 'hero_video_url') {
    return (
      <MediaUploader
        type="video"
        value={value ? [value] : []}
        onChange={(urls) => onChange(urls[0] || '')}
        multiple={false}
        maxFiles={1}
        folder="settings/videos"
        disabled={disabled}
        onUploadingChange={onUploadingChange}
      />
    )
  }

  if (IMAGE_SETTINGS.has(setting.key)) {
    return (
      <ImageUploader
        value={value ? [value] : []}
        onChange={(urls) => onChange(urls[0] || '')}
        multiple={false}
        maxFiles={1}
        folder="settings/images"
        disabled={disabled}
        onUploadingChange={onUploadingChange}
      />
    )
  }

  if (setting.key === 'home_videos_list') {
    return <HomeVideosEditor value={value} onChange={onChange} disabled={disabled} onUploadingChange={onUploadingChange} />
  }

  if (setting.key === 'home_before_after_pairs') {
    return <BeforeAfterEditor value={value} onChange={onChange} disabled={disabled} onUploadingChange={onUploadingChange} />
  }

  if (setting.value_type === 'long' || (value || '').length > 80) {
    return <textarea value={value || ''} onChange={(event) => onChange(event.target.value)} rows={3} className="input-base resize-none" />
  }

  return <input value={value || ''} onChange={(event) => onChange(event.target.value)} className="input-base" />
}

const parseSettingList = (value) => {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const AdminSettingsPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { data: settings = [] } = useQuery({ queryKey: ['admin-settings'], queryFn: () => settingsService.list() })
  const [values, setValues] = useState({})
  const [activeGroup, setActiveGroup] = useState('general')
  const [uploadsInProgress, setUploadsInProgress] = useState(0)
  const [isDirty, setIsDirty] = useState(false)
  const isUploading = uploadsInProgress > 0

  useEffect(() => {
    if (isDirty || settings.length === 0) return
    const init = {}
    settings.forEach((setting) => { init[setting.key] = setting.value })
    setValues(init)
  }, [settings, isDirty])

  const updateM = useMutation({
    mutationFn: settingsService.bulkUpdate,
    onSuccess: () => {
      qc.setQueryData(['admin-settings'], (current = []) => current.map((setting) => ({
        ...setting,
        value: values[setting.key] ?? setting.value,
      })))
      setIsDirty(false)
      qc.invalidateQueries(['admin-settings'])
      toast.success('Settings saved')
    },
  })

  const handleUploadingChange = (active) => {
    setUploadsInProgress((current) => Math.max(0, current + (active ? 1 : -1)))
  }

  const updateValue = (key, value) => {
    setIsDirty(true)
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isUploading) return

    const videos = parseSettingList(values.home_videos_list)
    if (videos.some((video) => !video.src || !video.label_en || !video.label_es)) {
      toast.error('Completa el archivo y los títulos de cada vídeo')
      return
    }

    const pairs = parseSettingList(values.home_before_after_pairs)
    if (pairs.some((pair) => !pair.before || !pair.after || !pair.title_en || !pair.title_es)) {
      toast.error('Completa las imágenes y los títulos de cada antes/después')
      return
    }

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
            <SettingControl
              setting={s}
              value={values[s.key] || ''}
              onChange={(value) => updateValue(s.key, value)}
              onUploadingChange={handleUploadingChange}
              disabled={isUploading}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={updateM.isPending || isUploading}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-paper text-sm"
        >
          <Save size={16} />
          {isUploading ? 'Subiendo…' : updateM.isPending ? '…' : t('admin.save')}
        </button>
      </form>
      </div>
    </AdminShell>
  )
}
