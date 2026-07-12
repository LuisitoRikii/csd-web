import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`w-full pointer-events-auto bg-paper rounded-3xl shadow-lift border border-line max-h-[90vh] flex flex-col ${
                size === 'sm' ? 'max-w-md' :
                size === 'md' ? 'max-w-2xl' :
                'max-w-4xl'
              }`}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-line">
                  <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
                  <button onClick={onClose} className="p-2 hover:bg-cream rounded-full transition-colors">
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
