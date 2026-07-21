import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CheckCircle2, Upload, X, ArrowUpRight, ArrowLeft, ArrowRight, FileImage, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { quoteService, uploadService, serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { SEO, buildBreadcrumbSchema } from '@/components/ui/SEO'

import { useSiteSettings } from '@/hooks/useSiteSettings'

export const QuotePage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { quote } = useSiteSettings()
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, trigger, getValues } = useForm({ mode: 'onTouched' })
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

  const STEPS = [
    { id: 1, title: t('quote_page.step_1_title') },
    { id: 2, title: t('quote_page.step_2_title') },
    { id: 3, title: t('quote_page.step_3_title') },
  ]

  const title = lang === 'es' ? 'Solicitar Cotización | CSD' : 'Request a Quote | CSD'
  const description = lang === 'es'
    ? 'Solicita tu cotización gratis para pintura, epóxico, murales, remodelación o mantenimiento en Miami. Respuesta en 24 horas.'
    : 'Request your free quote for painting, epoxy, murals, remodeling or maintenance in Miami. Response within 24 hours.'

  if (submitted) {
    return (
      <>
        <SEO
          title={title}
          description={description}
          path="/quote"
          noindex
        />
        <section className="min-h-[80vh] flex items-center justify-center bg-canvas">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="container-x max-w-2xl text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-violet/10 text-violet flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-serif text-display-md tracking-tight mb-4">
              {t('quote_page.success_title')}
            </h2>
            <p className="text-lg text-charcoal/80 mb-8">{t('quote_page.success_desc')}</p>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-paper text-sm font-medium hover:bg-graphite transition-all"
            >
              {t('quote_page.see_our_work')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/quote"
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Request a Quote', path: '/quote' },
        ])}
      />

      <PageHero title={t('quote_page.title')} subtitle={t('quote_page.subtitle')} />

      {/* Subtle tinted section so the white card lifts off the page */}
      <section className="relative pb-32 pt-12 lg:pt-20 bg-subtle">
        <div className="container-x max-w-4xl">
          {/* Floating form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl bg-paper border border-line shadow-card overflow-hidden"
          >
            {/* Tri-color accent stripe at the top — the brand mark */}
            <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1 bg-gradient-spectrum" />

            {/* Stepper */}
            <div className="px-8 pt-12 pb-8 border-b border-line">
              <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex-1 flex items-center gap-3">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          step > s.id
                            ? 'bg-ink text-paper'
                            : step === s.id
                              ? 'text-paper shadow-glow-violet'
                              : 'bg-muted text-steel'
                        }`}
                        style={step === s.id ? { backgroundImage: 'linear-gradient(95deg, #91F2D7, #8A04F0, #D925A9)' } : undefined}
                      >
                        {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                      </div>
                      <span
                        className={`text-[11px] uppercase tracking-[0.18em] font-semibold text-center hidden md:block ${
                          step === s.id ? 'text-ink' : 'text-steel'
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px bg-line relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-spectrum transition-all duration-500 ease-smooth"
                          style={{ width: step > s.id ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-10">
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
                      <input
                        type="email"
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        className="input-base"
                      />
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
                    <input
                      {...register('address')}
                      className="input-base"
                      placeholder={t('quote_page.placeholder_address')}
                    />
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
                        isDragActive ? 'border-violet bg-violet/5' : 'border-line bg-subtle hover:border-ink/40'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto mb-3 text-steel" size={28} />
                      <p className="text-sm text-charcoal">{t('quote_page.images_help')}</p>
                      {uploading && <p className="text-xs text-steel mt-2">{t('quote_page.uploading')}</p>}
                    </div>
                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {images.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-subtle group">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-paper text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl bg-subtle border border-line p-5">
                    <h4 className="text-xs uppercase tracking-wider text-steel mb-3">
                      {t('quote_page.summary_heading')}
                    </h4>
                    <ul className="text-sm space-y-1.5">
                      <li><span className="text-steel">{t('quote_page.field_name')}:</span> {watch('first_name')} {watch('last_name')}</li>
                      <li><span className="text-steel">{t('quote_page.field_email')}:</span> {watch('email')}</li>
                      <li><span className="text-steel">{t('quote_page.field_phone')}:</span> {watch('phone')}</li>
                      {watch('address') && <li><span className="text-steel">{t('quote_page.field_address')}:</span> {watch('address')}</li>}
                      <li><span className="text-steel">{t('quote_page.field_property')}:</span> {watch('property_type') || t('quote_page.field_empty')}</li>
                      <li><span className="text-steel">{t('quote_page.field_images')}:</span> {images.length}</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Nav */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-line">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-sm hover:bg-subtle transition-colors"
                  >
                    <ArrowLeft size={14} /> {t('quote_page.back')}
                  </button>
                ) : <div />}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-ink text-paper text-sm"
                  >
                    {t('quote_page.next')} <ArrowRight size={14} />
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
          </motion.div>

          {/* Side panel — also lifted as a separate card with breathing room */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="mt-12 lg:mt-16 rounded-3xl bg-paper border border-line shadow-soft overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 items-stretch">
              <div className="lg:col-span-3 p-8 lg:p-12">
                <div className="inline-flex w-11 h-11 rounded-full bg-violet/10 text-violet items-center justify-center mb-5">
                  <FileImage size={18} aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl tracking-tight mb-3 text-ink">
                  {t('quote_page.why_title')}
                </h3>
                <p className="text-sm text-charcoal/80 leading-relaxed mb-6 max-w-md">
                  {t('quote_page.why_body')}
                </p>
                <ul className="space-y-3 text-sm">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-violet shrink-0 mt-0.5" />
                      <span className="text-charcoal">{t(`quote_page.why_feature_${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-2 hidden lg:block relative bg-muted min-h-[280px]">
                <img
                  src={quote.heroImage || "https://images.unsplash.com/photo-1561409037-c7be81613c1f?w=1200&auto=format&fit=crop&q=85"}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </>
  )
}

const Input = ({ label, error, required, children }) => {
  const { t } = useTranslation()
  return (
    <div>
      <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 flex items-center gap-1">
        {label}
        {required && <span className="text-ink/60">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-red-600 mt-1.5 block">
          {error.type === 'required'
            ? t('quote_page.error_required')
            : error.type === 'minLength'
              ? t('quote_page.error_min_length_long')
              : error.type === 'pattern'
                ? t('quote_page.error_invalid_email')
                : t('common.invalid')}
        </span>
      )}
    </div>
  )
}
