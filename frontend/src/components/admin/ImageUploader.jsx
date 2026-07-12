import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { uploadService } from '@/services'
import { Upload, X } from 'lucide-react'

export const ImageUploader = ({ value = [], onChange, multiple = true, maxFiles = 20 }) => {
  const [uploading, setUploading] = useState(false)

  const onDrop = async (files) => {
    setUploading(true)
    try {
      if (multiple) {
        const res = await uploadService.images(files.slice(0, maxFiles))
        onChange([...value, ...res.urls])
      } else {
        const res = await uploadService.image(files[0])
        onChange([res.url])
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-cyan bg-cyan/5' : 'border-line bg-cream hover:border-ink/40'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 text-steel" size={22} />
        <p className="text-sm text-charcoal">{uploading ? 'Uploading…' : 'Click or drop images'}</p>
      </div>
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-paper text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
