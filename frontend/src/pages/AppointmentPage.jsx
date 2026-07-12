import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, Calendar as CalIcon } from 'lucide-react'
import { appointmentService, serviceService } from '@/services'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'
import { PageHero } from '@/components/ui/PageHero'
import { APP_BASE_URL } from '@/config'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']

export const AppointmentPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  const { data: services = [] } = useQuery({
    queryKey: ['services-public'],
    queryFn: () => serviceService.list({ active_only: true }),
  })

  const onSubmit = async (data) => {
    try {
      const [year, month, day] = data.appointment_date.split('-').map(Number)
      const [hours, minutes] = data.appointment_time.split(':').map(Number)
      const isoDate = new Date(Date.UTC(year, month - 1, day, hours, minutes)).toISOString()
      await appointmentService.create({
        ...data,
        appointment_date: isoDate,
        appointment_time: data.appointment_time,
        language: lang,
      })
      setSubmitted(true)
      toast.success(t('appointment_page.success_desc'))
    } catch {
      toast.error(t('common.error'))
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <>
      <Helmet>
        <title>{lang === 'es' ? 'Agendar Visita | CSD' : 'Schedule Visit | CSD'}</title>
        <link rel="canonical" href={`${APP_BASE_URL}/appointment`} />
      </Helmet>

      <PageHero title={t('appointment_page.title')} subtitle={t('appointment_page.subtitle')} />

      <section className="pb-32">
        <div className="container-x max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label={t('appointment_page.first_name')} error={errors.first_name}>
                <input {...register('first_name', { required: true })} className="input-base" />
              </Input>
              <Input label={t('appointment_page.last_name')} error={errors.last_name}>
                <input {...register('last_name', { required: true })} className="input-base" />
              </Input>
              <Input label={t('appointment_page.email')} error={errors.email}>
                <input type="email" {...register('email', { required: true })} className="input-base" />
              </Input>
              <Input label={t('appointment_page.phone')} error={errors.phone}>
                <input type="tel" {...register('phone', { required: true })} className="input-base" />
              </Input>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label={t('appointment_page.date')} error={errors.appointment_date}>
                <input
                  type="date"
                  min={minDate}
                  {...register('appointment_date', { required: true })}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-base"
                />
              </Input>
              <Input label={t('appointment_page.time')} error={errors.appointment_time}>
                <select
                  {...register('appointment_time', { required: true })}
                  className="input-base"
                  disabled={!selectedDate}
                >
                  <option value="">{t('appointment_page.time_placeholder')}</option>
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Input>
            </div>

            <Input label={t('appointment_page.service')}>
              <select {...register('service_type')} className="input-base">
                <option value="">{t('appointment_page.service_placeholder')}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {lang === 'es' ? s.title_es : s.title_en}
                  </option>
                ))}
              </select>
            </Input>

            <Input label={t('appointment_page.address')}>
              <input {...register('address')} className="input-base" />
            </Input>

            <Input label={t('appointment_page.notes')}>
              <textarea rows={4} {...register('notes')} className="input-base resize-none" />
            </Input>

            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <CalIcon size={16} />
              {isSubmitting ? t('appointment_page.submitting') : t('appointment_page.submit')}
            </button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900"
              >
                <CheckCircle2 size={20} />
                <span className="text-sm">{t('appointment_page.success_desc')}</span>
              </motion.div>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

const Input = ({ label, error, children }) => (
  <div>
    <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 block">{label}</label>
    {children}
    {error && <span className="text-xs text-red-600 mt-1.5 block">Required</span>}
  </div>
)
