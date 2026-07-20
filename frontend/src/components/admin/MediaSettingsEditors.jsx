import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { MediaUploader } from '@/components/admin/MediaUploader'

const parseList = (value) => {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs text-steel mb-1.5">{label}</span>
    {children}
  </label>
)

export const HomeVideosEditor = ({ value, onChange, onUploadingChange, disabled = false }) => {
  const items = parseList(value)
  const [uploadsInProgress, setUploadsInProgress] = useState(0)
  const isUploading = uploadsInProgress > 0
  const handleUploadingChange = (active) => {
    setUploadsInProgress((current) => Math.max(0, current + (active ? 1 : -1)))
    onUploadingChange?.(active)
  }
  const commit = (next) => onChange(JSON.stringify(next))
  const update = (index, patch) => commit(items.map((item, current) => current === index ? { ...item, ...patch } : item))
  const remove = (index) => commit(items.filter((_, current) => current !== index))
  const add = () => commit([
    ...items,
    { id: `video-${Date.now()}`, label_en: '', label_es: '', poster: '', src: '' },
  ])

  return (
    <fieldset disabled={disabled || isUploading} aria-busy={isUploading} className="space-y-4 disabled:opacity-75">
      {items.map((item, index) => (
        <div key={index} className="rounded-2xl border border-line bg-subtle p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">Vídeo {index + 1}</p>
            <button type="button" onClick={() => remove(index)} className="w-8 h-8 rounded-full text-red-600 hover:bg-red-50 flex items-center justify-center" aria-label="Eliminar vídeo">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Archivo de vídeo">
              <MediaUploader
                type="video"
                value={item.src ? [item.src] : []}
                onChange={(urls) => update(index, { src: urls[0] || '' })}
                multiple={false}
                maxFiles={1}
                folder="settings/videos"
                disabled={disabled || isUploading}
                onUploadingChange={handleUploadingChange}
              />
            </Field>
            <Field label="Imagen de portada">
              <ImageUploader
                value={item.poster ? [item.poster] : []}
                onChange={(urls) => update(index, { poster: urls[0] || '' })}
                multiple={false}
                maxFiles={1}
                folder="settings/images"
                disabled={disabled || isUploading}
                onUploadingChange={handleUploadingChange}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Identificador">
              <input value={item.id || ''} onChange={(event) => update(index, { id: event.target.value })} className="input-base" />
            </Field>
            <Field label="Título (EN)">
              <input value={item.label_en || ''} onChange={(event) => update(index, { label_en: event.target.value })} className="input-base" />
            </Field>
            <Field label="Título (ES)">
              <input value={item.label_es || ''} onChange={(event) => update(index, { label_es: event.target.value })} className="input-base" />
            </Field>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-line text-sm hover:bg-subtle">
        <Plus size={14} /> Añadir vídeo
      </button>
    </fieldset>
  )
}

export const BeforeAfterEditor = ({ value, onChange, onUploadingChange, disabled = false }) => {
  const items = parseList(value)
  const [uploadsInProgress, setUploadsInProgress] = useState(0)
  const isUploading = uploadsInProgress > 0
  const handleUploadingChange = (active) => {
    setUploadsInProgress((current) => Math.max(0, current + (active ? 1 : -1)))
    onUploadingChange?.(active)
  }
  const commit = (next) => onChange(JSON.stringify(next))
  const update = (index, patch) => commit(items.map((item, current) => current === index ? { ...item, ...patch } : item))
  const remove = (index) => commit(items.filter((_, current) => current !== index))
  const add = () => commit([
    ...items,
    { key: `project-${Date.now()}`, tag: '', title_en: '', title_es: '', before: '', after: '', scope_en: '', scope_es: '' },
  ])

  return (
    <fieldset disabled={disabled || isUploading} aria-busy={isUploading} className="space-y-4 disabled:opacity-75">
      {items.map((item, index) => (
        <div key={index} className="rounded-2xl border border-line bg-subtle p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">Antes / después {index + 1}</p>
            <button type="button" onClick={() => remove(index)} className="w-8 h-8 rounded-full text-red-600 hover:bg-red-50 flex items-center justify-center" aria-label="Eliminar comparación">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Imagen antes">
              <ImageUploader
                value={item.before ? [item.before] : []}
                onChange={(urls) => update(index, { before: urls[0] || '' })}
                multiple={false}
                maxFiles={1}
                folder="settings/before-after"
                disabled={disabled || isUploading}
                onUploadingChange={handleUploadingChange}
              />
            </Field>
            <Field label="Imagen después">
              <ImageUploader
                value={item.after ? [item.after] : []}
                onChange={(urls) => update(index, { after: urls[0] || '' })}
                multiple={false}
                maxFiles={1}
                folder="settings/before-after"
                disabled={disabled || isUploading}
                onUploadingChange={handleUploadingChange}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Título (EN)">
              <input value={item.title_en || ''} onChange={(event) => update(index, { title_en: event.target.value })} className="input-base" />
            </Field>
            <Field label="Título (ES)">
              <input value={item.title_es || ''} onChange={(event) => update(index, { title_es: event.target.value })} className="input-base" />
            </Field>
            <Field label="Trabajo realizado (EN)">
              <input value={item.scope_en || ''} onChange={(event) => update(index, { scope_en: event.target.value })} className="input-base" />
            </Field>
            <Field label="Trabajo realizado (ES)">
              <input value={item.scope_es || ''} onChange={(event) => update(index, { scope_es: event.target.value })} className="input-base" />
            </Field>
            <Field label="Identificador">
              <input value={item.key || ''} onChange={(event) => update(index, { key: event.target.value })} className="input-base" />
            </Field>
            <Field label="Etiqueta">
              <input value={item.tag || ''} onChange={(event) => update(index, { tag: event.target.value })} className="input-base" />
            </Field>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-line text-sm hover:bg-subtle">
        <Plus size={14} /> Añadir comparación
      </button>
    </fieldset>
  )
}
