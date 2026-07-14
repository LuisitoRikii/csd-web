import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowUpRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { contactService } from '@/services'
import { BUSINESS } from '@/config'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_BASE_URL } from '@/config'
import { WHATSAPP_NUMBER } from '@/config'
import { PageHero } from '@/components/ui/PageHero'

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

  return (
    <>
      <Helmet>
        <title>{lang === 'es' ? 'Contacto | CSD Good Services' : 'Contact | CSD Good Services'}</title>
        <link rel="canonical" href={`${APP_BASE_URL}/contact`} />
      </Helmet>

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
                    placeholder="Jane Doe"
                  />
                </Input>
                <Input label={t('contact_page.email')} error={errors.email} required>
                  <input
                    type="email"
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    className="input-base"
                    placeholder="jane@email.com"
                  />
                </Input>
                <Input label={t('contact_page.phone')} error={errors.phone}>
                  <input
                    {...register('phone')}
                    className="input-base"
                    placeholder="+1 (555) 555-0123"
                  />
                </Input>
                <Input label={t('contact_page.subject')} error={errors.subject}>
                  <input
                    {...register('subject')}
                    className="input-base"
                    placeholder="Mural commission"
                  />
                </Input>
              </div>

              <Input label={t('contact_page.message')} error={errors.message} required>
                <textarea
                  {...register('message', { required: true, minLength: 10 })}
                  rows={6}
                  className="input-base resize-none"
                  placeholder="Tell us about your space and your idea..."
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
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900"
                >
                  <CheckCircle2 size={20} />
                  <span className="text-sm">{t('contact_page.success')}</span>
                </motion.div>
              )}
            </form>
          </div>

          <aside className="lg:col-span-5 space-y-8">
            <div className="space-y-5">
              <ContactItem icon={MapPin} label="Address" value={BUSINESS.address} />
              <ContactItem icon={Phone} label="Phone" value={BUSINESS.phone} href={`tel:${BUSINESS.phone}`} />
              <ContactItem icon={Mail} label="Email" value={BUSINESS.email} href={`mailto:${BUSINESS.email}`} />
              <ContactItem icon={Clock} label="Hours" value={BUSINESS.hours} />
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 rounded-3xl bg-emerald-500 text-paper hover:bg-emerald-600 transition-colors"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">Quick Chat</p>
                <p className="font-serif text-2xl mt-1">WhatsApp</p>
              </div>
              <ArrowUpRight size={28} />
            </a>

            <div className="rounded-3xl overflow-hidden border border-line aspect-video">
              <iframe
                title="Map"
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

const Input = ({ label, error, required, children }) => (
  <div>
    <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 flex items-center gap-1">
      {label}
      {required && <span className="text-magenta">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
        <AlertCircle size={12} /> {error.type === 'required' ? 'Required' : error.type === 'minLength' ? 'Min 10 characters' : 'Invalid'}
      </span>
    )}
  </div>
)

const ContactItem = ({ icon: Icon, label, value, href }) => {
  const content = (
    <>
      <div className="w-11 h-11 rounded-full bg-cream flex items-center justify-center text-charcoal flex-shrink-0">
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