import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, Upload, X, ArrowUpRight, ArrowLeft, ArrowRight, FileImage, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { quoteService, uploadService, serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_BASE_URL } from '@/config'
import { PageHero } from '@/components/ui/PageHero'

const STEPS = [
  { id: 1, title_en: 'About you', title_es: 'Sobre ti' },
  { id: 2, title_en: 'Project', title_es: 'Proyecto' },
  { id: 3, title_en: 'Photos & send', title_es: 'Fotos y enviar' },
]

export const QuotePage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, trigger, getValues } = useForm({ mode: 'onTouched' })
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)

  const { data: services = [] } = useQuery({
    queryKey: ['services-public'],
    queryFn: () => serviceService.list({ active_only: true }),
  })

  const onDrop = async (files) => {
    setUploading(true)
    try {
      const result = await uploadService.images(files.slice(0, 10))
      setImages((prev) => [...prev, ...result.urls])
    } catch (e) {
      toast.error(t('common.error'))
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 10,
  })

  const next = async () => {
    let valid = false
    if (step === 1) {
      valid = await trigger(['first_name', 'last_name', 'email', 'phone'])
    } else if (step === 2) {
      valid = await trigger(['description'])
    }
    if (valid) setStep((s) => Math.min(3, s + 1))
  }

  const back = () => setStep((s) => Math.max(1, s - 1))

  const onSubmit = async (data) => {
    try {
      const selectedService = services.find((s) => s.id === Number(data.service_id))
      await quoteService.create({
        ...data,
        service_name: selectedService ? (lang === 'es' ? selectedService.title_es : selectedService.title_en) : '',
        images,
        language: lang,
      })
      setSubmitted(true)
      toast.success(t('quote_page.success_desc'))
    } catch {
      toast.error(t('common.error'))
    }
  }

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>{lang === 'es' ? 'Solicitar Cotización | CSD' : 'Request a Quote | CSD'}</title>
        </Helmet>
        <section className="min-h-[80vh] flex items-center justify-center bg-canvas">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="container-x max-w-2xl text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-serif text-display-md tracking-tight mb-4">
              {t('quote_page.success_title')}
            </h2>
            <p className="text-lg text-charcoal/80 mb-8">{t('quote_page.success_desc')}</p>
            <a
              href="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-all"
            >
              {t('hero.cta_secondary')} <ArrowRight size={16} />
            </a>
          </motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{lang === 'es' ? 'Solicitar Cotización | CSD' : 'Request a Quote | CSD'}</title>
        <link rel="canonical" href={`${APP_BASE_URL}/quote`} />
      </Helmet>

      <PageHero title={t('quote_page.title')} subtitle={t('quote_page.subtitle')} />

      <section className="pb-32">
        <div className="container-x max-w-4xl">
          {/* Stepper */}
          <div className="mb-12">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex-1 flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step > s.id ? 'bg-ink text-paper' :
                      step === s.id ? 'bg-cyan text-paper' :
                      'bg-cream text-steel'
                    }`}
                  >
                    {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                  </div>
                  <span className={`text-sm hidden md:inline ${step === s.id ? 'text-ink' : 'text-steel'}`}>
                    {lang === 'es' ? s.title_es : s.title_en}
                  </span>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px bg-line" />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1 — About you */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label={t('quote_page.first_name')} error={errors.first_name} required>
                    <input {...register('first_name', { required: true })} className="input-base" />
                  </Input>
                  <Input label={t('quote_page.last_name')} error={errors.last_name} required>
                    <input {...register('last_name', { required: true })} className="input-base" />
                  </Input>
                  <Input label={t('quote_page.email')} error={errors.email} required>
                    <input type="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className="input-base" />
                  </Input>
                  <Input label={t('quote_page.phone')} error={errors.phone} required>
                    <input type="tel" {...register('phone', { required: true })} className="input-base" />
                  </Input>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Project */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <Input label={t('quote_page.service')}>
                  <select {...register('service_id')} className="input-base">
                    <option value="">{t('quote_page.service_placeholder')}</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {lang === 'es' ? s.title_es : s.title_en}
                      </option>
                    ))}
                  </select>
                </Input>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label={t('quote_page.property_type')}>
                    <select {...register('property_type')} className="input-base">
                      <option value="">{t('quote_page.property_placeholder')}</option>
                      <option value="residential">{t('quote_page.property_residential')}</option>
                      <option value="commercial">{t('quote_page.property_commercial')}</option>
                      <option value="industrial">{t('quote_page.property_industrial')}</option>
                    </select>
                  </Input>
                  <Input label={t('quote_page.budget')}>
                    <select {...register('budget')} className="input-base">
                      <option value="">{t('quote_page.budget_placeholder')}</option>
                      <option value="1">{t('quote_page.budget_1')}</option>
                      <option value="2">{t('quote_page.budget_2')}</option>
                      <option value="3">{t('quote_page.budget_3')}</option>
                      <option value="4">{t('quote_page.budget_4')}</option>
                    </select>
                  </Input>
                </div>

                <Input label={t('quote_page.address')}>
                  <input {...register('address')} className="input-base" placeholder="123 Main St, Miami, FL" />
                </Input>

                <Input label={t('quote_page.description')} error={errors.description} required>
                  <textarea
                    rows={6}
                    {...register('description', { required: true, minLength: 20 })}
                    className="input-base resize-none"
                  />
                </Input>

                <Input label={t('quote_page.estimated_date')}>
                  <input type="date" {...register('estimated_date')} className="input-base" />
                </Input>
              </motion.div>
            )}

            {/* Step 3 — Photos & send */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 block">
                    {t('quote_page.images')}
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                      isDragActive ? 'border-magenta bg-magenta/5' : 'border-line bg-cream hover:border-ink/40'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-3 text-steel" size={28} />
                    <p className="text-sm text-charcoal">{t('quote_page.images_help')}</p>
                    {uploading && <p className="text-xs text-steel mt-2">Uploading...</p>}
                  </div>
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {images.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-cream group">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-paper text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="rounded-2xl bg-cream border border-line p-5">
                  <h4 className="text-xs uppercase tracking-wider text-steel mb-3">Summary</h4>
                  <ul className="text-sm space-y-1.5">
                    <li><span className="text-steel">Name:</span> {watch('first_name')} {watch('last_name')}</li>
                    <li><span className="text-steel">Email:</span> {watch('email')}</li>
                    <li><span className="text-steel">Phone:</span> {watch('phone')}</li>
                    {watch('address') && <li><span className="text-steel">Address:</span> {watch('address')}</li>}
                    <li><span className="text-steel">Property:</span> {watch('property_type') || '—'}</li>
                    <li><span className="text-steel">Images:</span> {images.length}</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Nav */}
            <div className="flex justify-between pt-6 border-t border-line">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-sm hover:bg-cream transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-ink text-paper text-sm"
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  <Send size={14} />
                  {isSubmitting ? t('quote_page.submitting') : t('quote_page.submit')}
                </button>
              )}
            </div>
          </form>

          {/* Side panel */}
          <aside className="mt-16 rounded-3xl bg-cream border border-line p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <FileImage size={32} className="text-magenta mb-4" />
                <h3 className="font-serif text-2xl tracking-tight mb-3">Why CSD</h3>
                <p className="text-sm text-charcoal/80 leading-relaxed mb-6">
                  We reply within 24 hours with a thoughtful plan and a transparent, itemized estimate — never a rush quote.
                </p>
                <ul className="space-y-3 text-sm">
                  {['Free on-site visit', 'Detailed itemized quote', 'Senior craftsmen on every job', 'Permit-ready paperwork'].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-cyan" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden lg:block rounded-3xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1200&auto=format&fit=crop&q=85"
                  alt="Working team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

const Input = ({ label, error, required, children }) => (
  <div>
    <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 flex items-center gap-1">
      {label}
      {required && <span className="text-magenta">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-xs text-red-600 mt-1.5 block">
        {error.type === 'required' ? 'Required' : error.type === 'minLength' ? 'Min 20 characters' : 'Invalid'}
      </span>
    )}
  </div>
)
