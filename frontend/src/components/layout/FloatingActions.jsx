import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/config'

export const FloatingActions = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-paper rounded-2xl shadow-lift p-5 w-72 border border-line"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan via-violet to-magenta flex items-center justify-center text-paper font-bold text-sm">
                CS
              </div>
              <div>
                <p className="text-sm font-medium">CSD Studio</p>
                <p className="text-xs text-steel flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Typically replies in minutes
                </p>
              </div>
            </div>
            <p className="text-sm text-charcoal mb-4">
              Hello 👋 How can we help you transform your space today?
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'd like to learn more about your services.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-emerald-500 text-paper text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle size={16} />
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-ink text-paper shadow-lift flex items-center justify-center hover:bg-graphite transition-colors relative"
        aria-label="WhatsApp"
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan animate-pulse" />
        )}
      </button>
    </div>
  )
}
