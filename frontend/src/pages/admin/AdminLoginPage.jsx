import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services'
import { useAuth } from '@/contexts/AuthContext'

export const AdminLoginPage = () => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authService.login(data)
      login(res.access_token, res.user)
      toast.success(t('admin.welcome_heading'))
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (e) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <svg width="36" height="36" viewBox="0 0 64 64">
              <defs>
                <linearGradient id="logoL" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#5B2A8F" />
                  <stop offset="50%" stopColor="#A37052" />
                  <stop offset="100%" stopColor="#7DD8BC" />
                </linearGradient>
              </defs>
              <path d="M16 44 L20 20 L24 18 L32 16 L40 18 L44 20 L48 44 L40 40 L32 42 L24 40 Z" fill="url(#logoL)" />
              <circle cx="32" cy="32" r="5" fill="#FAFAF7" />
            </svg>
            <span className="font-serif text-xl">CSD</span>
          </Link>

          <h1 className="font-serif text-4xl tracking-tight mb-2">{t('admin.login_welcome_heading')}</h1>
          <p className="text-charcoal/70 mb-10">{t('admin.login_welcome_subheading')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 block">{t('admin.login_email_label')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="input-base pl-12"
                  placeholder="admin@csdgoodservices.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 block">{t('admin.login_password_label')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
                <input
                  type="password"
                  {...register('password', { required: true })}
                  className="input-base pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? '...' : t('admin.login_submit')}
              <ArrowUpRight size={16} />
            </button>
          </form>

          <div className="mt-10 p-4 rounded-2xl bg-subtle border border-line text-xs text-steel">
            <p className="font-medium text-ink mb-1">{t('admin.login_demo_note')}</p>
            <p>admin@csdgoodservices.com · Admin123!</p>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1 text-xs text-steel hover:text-ink transition-colors"
          >
            ← {t('admin.login_back_home')}
          </Link>
        </motion.div>
      </div>

      <div className="hidden lg:flex relative bg-ink text-paper items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #5B2A8F, transparent 50%), radial-gradient(circle at 70% 70%, #A37052, transparent 50%), radial-gradient(circle at 50% 80%, #7DD8BC, transparent 50%)',
          }}
        />
        <div className="relative z-10 text-center px-12">
          <p className="text-xs tracking-[0.2em] uppercase text-paper/70 mb-4">{t('admin.login_brand_label')}</p>
          <h2 className="font-serif text-display-md tracking-tight mb-4">
            {t('admin.welcome_subheading')}
          </h2>
        </div>
      </div>
    </div>
  )
}
