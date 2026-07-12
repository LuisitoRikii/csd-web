import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services'
import { useAuth } from '@/contexts/AuthContext'

export const AdminLoginPage = () => {
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
      toast.success('Welcome back')
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (e) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 lg:grid-cols-2">
      {/* Form */}
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
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
              </defs>
              <path d="M16 44 L20 20 L24 18 L32 16 L40 18 L44 20 L48 44 L40 40 L32 42 L24 40 Z" fill="url(#logoL)" />
              <circle cx="32" cy="32" r="5" fill="#FAFAF7" />
            </svg>
            <span className="font-serif text-xl">CSD</span>
          </Link>

          <h1 className="font-serif text-4xl tracking-tight mb-2">Welcome back</h1>
          <p className="text-charcoal/70 mb-10">Sign in to manage your studio.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 block">Email</label>
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
              <label className="text-xs tracking-[0.2em] uppercase text-steel mb-2 block">Password</label>
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
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '...' : 'Sign in'}
              <ArrowUpRight size={16} />
            </button>
          </form>

          <div className="mt-10 p-4 rounded-2xl bg-cream border border-line text-xs text-steel">
            <p className="font-medium text-ink mb-1">Demo credentials</p>
            <p>admin@csdgoodservices.com · Admin123!</p>
          </div>
        </motion.div>
      </div>

      {/* Side art */}
      <div className="hidden lg:flex relative bg-ink text-paper items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #06B6D4, transparent 50%), radial-gradient(circle at 70% 70%, #D946EF, transparent 50%), radial-gradient(circle at 50% 80%, #8B5CF6, transparent 50%)',
          }}
        />
        <div className="relative z-10 text-center px-12">
          <p className="text-xs tracking-[0.2em] uppercase text-cyan mb-4">CSD Studio</p>
          <h2 className="font-serif text-display-md tracking-tight mb-4">
            Crafting spaces,<br />
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-magenta">
              one wall at a time.
            </span>
          </h2>
          <p className="text-paper/70 max-w-md mx-auto">
            Manage projects, services, requests and your studio journal from one place.
          </p>
        </div>
      </div>
    </div>
  )
}
