import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, X } from 'lucide-react'
import { BUSINESS, WHATSAPP_NUMBER } from '@/config'

// Using the mint accent (instead of WhatsApp green) to stay on-palette.
// Mint #91F2D7 reads as a fresh teal-green and remains visually similar enough
// to communicate the WhatsApp affordance while honoring the tri-color system.
const WA_BG = '#0A0A0F'

export const FloatingActions = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-paper rounded-2xl shadow-lift w-80 border border-line overflow-hidden"
          >
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 border-b border-line/70">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg bg-ink text-paper flex items-center justify-center text-sm font-semibold"
               >
                  CS
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">CSD Good Services</p>
                  <p className="text-xs text-steel flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    Typically replies in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-steel hover:text-ink transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-charcoal leading-relaxed">
                Hello — how can we help with your home today?
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'd like to learn more about your services.`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-ink text-paper text-sm font-semibold transition-colors hover:bg-graphite"
                style={{ background: WA_BG }}
              >
                <MessageCircle size={16} />
                Start Chat on WhatsApp
              </a>
              <div className="mt-3 flex flex-col gap-2">
                {(BUSINESS.phones || [BUSINESS.phone]).map((ph) => (
                  <a
                    key={ph}
                    href={`tel:${ph.replace(/[^+\d]/g, '')}`}
                    className="flex items-center gap-2 text-xs text-steel hover:text-ink transition-colors"
                  >
                    <Phone size={12} />
                    {ph}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="relative w-14 h-14 rounded-lg bg-ink text-paper shadow-soft flex items-center justify-center"
        style={{ background: WA_BG }}
        aria-label="WhatsApp"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: WA_BG }}
          />
        )}
      </motion.button>
    </div>
  )
}
