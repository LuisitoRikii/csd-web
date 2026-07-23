import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowUpRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { contactService } from '@/services'
import { BUSINESS, WHATSAPP_NUMBER } from '@/config'
import { useLanguage } from '@/contexts/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { SEO, buildBusinessSchema, buildBreadcrumbSchema } from '@/components/ui/SEO'

export const ContactPage = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    mode: 'onTouched',
  })
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (data) => {
    try {
      await contactService.send({ ...data, language: lang })
      setSubmitted(true)
      reset()
      toast.success(t('contact_page.success'))
    } catch (e) {
      toast.error(t('common.error'))
    }
  }

  const title = lang === 'es' ? 'Contacto | CSD Good Services' : 'Contact | CSD Good Services'
  const description = lang === 'es'
    ? 'Contacta a CSD Good Services en Miami. Cotización gratis para pintura, epóxico, murales, remodelación y mantenimiento. Teléfono, email y WhatsApp.'
    : 'Contact CSD Good Services in Miami. Free quotes for painting, epoxy, murals, remodeling and maintenance. Phone, email and WhatsApp available.'

  return (
    <>
      <SEO
        title={title}
        description={description}
        path="/contact"
        schema={buildBusinessSchema(lang)}
      />

      <PageHero title={t('contact_page.title')} subtitle={t('contact_page.subtitle')} />

      <section className="pb-32">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label={t('contact_page.name')} error={errors.name} required>
                  <input
                    {...register('name', { required: true })}
                    className="input-base"
                    placeholder={t('contact_page.placeholder_name')}
                  />
                </Input>
                <Input label={t('contact_page.email')} error={errors.email} required>
                  <input
                    type="email"
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    className="input-base"
                    placeholder={t('contact_page.placeholder_email')}
                  />
                </Input>
                <Input label={t('contact_page.phone')} error={errors.phone}>
                  <input
                    {...register('phone')}
                    className="input-base"
                    placeholder={t('contact_page.placeholder_phone')}
                  />
                </Input>
                <Input label={t('contact_page.subject')} error={errors.subject}>
                  <input
                    {...register('subject')}
                    className="input-base"
                    placeholder={t('contact_page.placeholder_subject')}
                  />
                </Input>
              </div>

              <Input label={t('contact_page.message')} error={errors.message} required>
                <textarea
                  {...register('message', { required: true, minLength: 10 })}
                  rows={6}
                  className="input-base resize-none"
                  placeholder={t('contact_page.placeholder_message')}
                />
              </Input>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? '...' : t('contact_page.submit')}
                <ArrowUpRight size={16} />
              </button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-brand-tint border border-brand-light text-brand"
                >
                  <CheckCircle2 size={20} />
                  <span className="text-sm">{t('contact_page.success')}</span>
                </motion.div>
              )}
            </form>
          </div>

          <aside className="lg:col-span-5 space-y-8">
            <div className="space-y-5">
              <ContactItem icon={MapPin} label={t('contact_page.field_address')} value={BUSINESS.address} />
              {(BUSINESS.phones || [BUSINESS.phone]).map((ph) => (
                <ContactItem
                  key={ph}
                  icon={Phone}
                  label={t('contact_page.field_phone')}
                  value={ph}
                  href={`tel:${ph.replace(/[^+\d]/g, '')}`}
                />
              ))}
              <ContactItem icon={Mail} label={t('contact_page.field_email')} value={BUSINESS.email} href={`mailto:${BUSINESS.email}`} />
              <ContactItem icon={Clock} label={t('contact_page.field_hours')} value={BUSINESS.hours} />
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 rounded-3xl bg-emerald-500 text-paper hover:bg-emerald-600 transition-colors"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">{t('contact_page.whatsapp_label_1')}</p>
                <p className="font-serif text-2xl mt-1">{t('contact_page.whatsapp_label_2')}</p>
              </div>
              <ArrowUpRight size={28} />
            </a>

            <div className="rounded-3xl overflow-hidden border border-line aspect-video">
              <iframe
                title={t('contact_page.map_title')}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.7!2d-80.325!3d25.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b1234567890%3A0x0!2s8215%20NW%2064th%20St%2C%20Medley%2C%20FL%2033166!5e0!3m2!1sen!2sus"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </aside>
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
        <span className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
          <AlertCircle size={12} />
          {error.type === 'required'
            ? t('contact_page.error_required')
            : error.type === 'pattern'
              ? t('contact_page.error_invalid_email')
              : t('common.invalid')}
        </span>
      )}
    </div>
  )
}

const ContactItem = ({ icon: Icon, label, value, href }) => {
  const content = (
    <>
      <div className="w-11 h-11 rounded-full bg-subtle flex items-center justify-center text-charcoal flex-shrink-0">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-steel">{label}</p>
        <p className="font-medium mt-0.5">{value}</p>
      </div>
    </>
  )
  return href ? (
    <a href={href} className="flex items-start gap-4 hover:opacity-80 transition-opacity">{content}</a>
  ) : (
    <div className="flex items-start gap-4">{content}</div>
  )
}
