import { useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Film, Upload, X } from 'lucide-react'
import { uploadService } from '@/services'
import { resolveMediaUrl } from '@/config'

const ACCEPT = {
  image: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  video: {
    'video/mp4': ['.mp4'],
  },
}

export const MediaUploader = ({
  value = [],
  onChange,
  type = 'image',
  multiple = true,
  maxFiles = 20,
  folder,
  disabled = false,
  onUploadingChange,
}) => {
  const [uploading, setUploading] = useState(false)
  const uploadedUrls = useRef(new Set())
  const values = useMemo(() => (Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []), [value])
  const limitReached = values.length >= maxFiles

  const onDrop = async (acceptedFiles) => {
    const files = acceptedFiles.slice(0, Math.max(0, maxFiles - values.length))
    if (!files.length) return
    if (files.reduce((total, file) => total + file.size, 0) > 200 * 1024 * 1024) {
      toast.error('La selección completa no puede superar 200 MB')
      return
    }

    setUploading(true)
    onUploadingChange?.(true)
    try {
      let urls
      if (type === 'video') {
        const uploaded = await Promise.all(files.map((file) => uploadService.video(file, folder || 'videos')))
        urls = uploaded.map((result) => result.url)
      } else if (multiple) {
        const result = await uploadService.images(files, folder || 'images')
        urls = result.urls
      } else {
        const result = await uploadService.image(files[0], folder || 'images')
        urls = [result.url]
      }

      urls.forEach((url) => uploadedUrls.current.add(url))
      onChange(multiple ? [...values, ...urls].slice(0, maxFiles) : urls.slice(0, 1))
    } catch (error) {
      toast.error(error.response?.data?.detail || 'No se pudo subir el archivo')
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  const removeMedia = (src, index) => {
    if (uploadedUrls.current.delete(src)) {
      uploadService.remove(src).catch(() => toast.error('No se pudo eliminar el archivo subido'))
    }
    onChange(values.filter((_, currentIndex) => currentIndex !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: () => toast.error(`Formato no permitido o archivo mayor de 50 MB`),
    accept: ACCEPT[type],
    multiple,
    maxFiles: multiple ? Math.max(1, maxFiles - values.length) : 1,
    maxSize: 50 * 1024 * 1024,
    disabled: disabled || uploading || limitReached,
  })

  const noun = type === 'video' ? 'vídeos' : 'imágenes'
  const UploadIcon = type === 'video' ? Film : Upload

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
          disabled || uploading || limitReached ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${isDragActive ? 'border-brand bg-brand/5' : 'border-line bg-subtle hover:border-ink/40'}`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="mx-auto mb-2 text-steel" size={22} />
        <p className="text-sm text-charcoal">
          {uploading ? 'Subiendo…' : limitReached ? `Máximo de ${maxFiles} archivos` : `Haz clic o arrastra ${noun}`}
        </p>
        <p className="mt-1 text-xs text-steel">Máximo 50 MB por archivo</p>
      </div>

      {values.length > 0 && (
        <div className={`mt-4 grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 max-w-sm'}`}>
          {values.map((src, index) => (
            <div key={`${src}-${index}`} className="relative aspect-video rounded-xl overflow-hidden group bg-ink">
              {type === 'video' ? (
                <video src={resolveMediaUrl(src)} controls preload="metadata" className="w-full h-full object-cover" />
              ) : (
                <img src={resolveMediaUrl(src)} alt="" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeMedia(src, index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-paper text-ink shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label="Eliminar archivo"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
