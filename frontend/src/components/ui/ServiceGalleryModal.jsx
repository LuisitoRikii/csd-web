import { useEffect, useId, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const FALLBACK_PROJECT_IMAGE =
  'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"%3E%3Crect width="16" height="10" fill="%23F1F3F6"/%3E%3C/svg%3E'

/**
 * ServiceGalleryModal — opens a native <dialog> showing every project linked
 * to a service. Accessible: focus trap and Esc-to-close come for free from
 * <dialog>. Scroll lock and focus restoration are added manually.
 *
 * Usage:
 *   <ServiceGalleryModal
 *     service={service}
 *     open={open}
 *     onClose={() => setOpen(false)}
 *   />
 */
export const ServiceGalleryModal = ({ service, open, onClose }) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en'
  const dialogRef = useRef(null)
  const titleId = useId()
  const openerRef = useRef(null)
  const reduced = useReducedMotion()
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const projects = service?.projects ?? []
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0] ?? null
  const activeImages = activeProject?.images?.length
    ? activeProject.images
    : activeProject?.cover_image
      ? [{ id: 'cover', image_url: activeProject.cover_image, alt_text: activeProject.title_en }]
      : []

  const title = service ? (lang === 'es' ? service.title_es : service.title_en) : ''
  const description = service ? (lang === 'es' ? service.description_es : service.description_en) : ''

  // Reset internal state when the modal opens for a different service
  useEffect(() => {
    if (open && service) {
      setActiveProjectId(projects[0]?.id ?? null)
      setActiveImageIndex(0)
    }
  }, [open, service?.id, projects])

  // Open / close the native <dialog>. Use showModal() so we get the backdrop
  // and the browser handles focus trapping and Esc automatically.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      try {
        dialog.showModal()
      } catch {
        /* showModal can throw if already open; ignore */
      }
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Body scroll lock + focus restoration. The <dialog> element traps focus,
  // but we still need to lock the page behind and return focus to the opener.
  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const dialog = dialogRef.current
    if (dialog) {
      const focusable = dialog.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    }

    return () => {
      document.body.style.overflow = prevOverflow
      if (openerRef.current && typeof openerRef.current.focus === 'function') {
        openerRef.current.focus()
      }
    }
  }, [open])

  // Native <dialog> emits a "close" event when Esc or the dialog's own close
  // button closes it. Wire that back to the React `onClose`.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => onClose?.()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  const goPrev = useCallback(() => {
    if (!activeImages.length) return
    setActiveImageIndex((i) => (i - 1 + activeImages.length) % activeImages.length)
  }, [activeImages.length])

  const goNext = useCallback(() => {
    if (!activeImages.length) return
    setActiveImageIndex((i) => (i + 1) % activeImages.length)
  }, [activeImages.length])

  const handleDialogClick = (e) => {
    // Clicking the backdrop (the <dialog> itself, not its content) closes it.
    if (e.target === dialogRef.current) onClose?.()
  }

  if (!service) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          aria-modal="true"
          onClick={handleDialogClick}
          onCancel={(e) => {
            // Esc triggers the native "cancel" event — let it bubble, the
            // close listener above will fire onClose.
            e.preventDefault()
            onClose?.()
          }}
          initial={reduced ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: reduced ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 max-w-none max-h-none w-screen h-screen p-0 bg-transparent text-ink backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
        >
          {/* Solid white panel — keeps backdrop separate from content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative m-auto mt-[max(env(safe-area-inset-top),1rem)] mb-[max(env(safe-area-inset-bottom),1rem)] mr-[max(env(safe-area-inset-right),1rem)] ml-[max(env(safe-area-inset-left),1rem)] w-[min(96rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl bg-paper border border-line shadow-lift flex flex-col"
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-6 px-8 py-6 border-b border-line">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.22em] text-steel font-semibold mb-1">
                  {t('services.gallery_label', 'Service Gallery')}
                </p>
                <h2 id={titleId} className="font-serif text-2xl lg:text-3xl tracking-tight text-ink truncate">
                  {title}
                </h2>
                {description && (
                  <p className="mt-2 text-sm text-charcoal/80 line-clamp-2 max-w-3xl">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('common.close', 'Close')}
                className="shrink-0 w-10 h-10 rounded-full bg-subtle hover:bg-muted text-ink flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Project list — fixed width on desktop */}
              {projects.length > 0 ? (
                <aside
                  aria-label={t('services.gallery_projects_label', 'Projects in this gallery')}
                  className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-line overflow-y-auto max-h-[40vh] lg:max-h-none"
                >
                  <ul role="list" className="p-4 space-y-2">
                    {projects.map((p) => {
                      const pt = lang === 'es' ? p.title_es : p.title_en
                      const active = (activeProject?.id ?? null) === p.id
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProjectId(p.id)
                              setActiveImageIndex(0)
                            }}
                            aria-pressed={active}
                            className={`group w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                              active ? 'bg-muted' : 'hover:bg-subtle'
                            }`}
                          >
                            <span className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={p.cover_image || FALLBACK_PROJECT_IMAGE}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-ink truncate">{pt}</span>
                              <span className="mt-0.5 flex items-center gap-2 text-[11px] text-steel">
                                {p.location && (
                                  <span className="inline-flex items-center gap-1 truncate">
                                    <MapPin size={10} aria-hidden="true" />
                                    {p.location}
                                  </span>
                                )}
                                {p.year && (
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar size={10} aria-hidden="true" />
                                    {p.year}
                                  </span>
                                )}
                              </span>
                            </span>
                            {active && (
                              <span
                                aria-hidden="true"
                                className="w-1 self-stretch rounded-full bg-gradient-spectrum"
                              />
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </aside>
              ) : null}

              {/* Image viewer */}
              <div className="lg:col-span-8 flex flex-col min-h-0">
                {activeProject && activeImages.length > 0 ? (
                  <>
                    <figure className="relative flex-1 min-h-[260px] lg:min-h-0 bg-ink overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={`${activeProject.id}-${activeImageIndex}`}
                          src={activeImages[activeImageIndex].image_url}
                          alt={
                            activeImages[activeImageIndex].alt_text ||
                            (lang === 'es' ? activeProject.title_es : activeProject.title_en)
                          }
                          initial={reduced ? false : { opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                          transition={{ duration: reduced ? 0.1 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0 w-full h-full object-contain"
                          loading="lazy"
                        />
                      </AnimatePresence>

                      {activeImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={goPrev}
                            aria-label={t('services.gallery_prev', 'Previous image')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/90 backdrop-blur text-ink flex items-center justify-center hover:bg-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                          >
                            <ChevronLeft size={18} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={goNext}
                            aria-label={t('services.gallery_next', 'Next image')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/90 backdrop-blur text-ink flex items-center justify-center hover:bg-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
                          >
                            <ChevronRight size={18} aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </figure>

                    <figcaption className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-line bg-paper">
                      <div className="min-w-0">
                        <p className="font-serif text-lg text-ink truncate">
                          {lang === 'es' ? activeProject.title_es : activeProject.title_en}
                        </p>
                        <p className="text-xs text-steel mt-0.5">
                          {activeProject.location ? `${activeProject.location}` : ''}
                          {activeProject.year ? ` · ${activeProject.year}` : ''}
                          {activeProject.services_used ? ` · ${activeProject.services_used}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {activeImages.length > 1 && (
                          <span className="text-xs text-steel tabular-nums">
                            {activeImageIndex + 1} / {activeImages.length}
                          </span>
                        )}
                        <Link
                          to={`/portfolio/${activeProject.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink hover:text-violet transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-full px-3 py-1.5"
                        >
                          {t('services.view_project', 'View project')}
                          <ExternalLink size={12} aria-hidden="true" />
                        </Link>
                      </div>
                    </figcaption>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-steel p-12 gap-3">
                    <ImageIcon size={32} aria-hidden="true" />
                    <p className="text-sm">
                      {t('services.gallery_empty', 'No projects linked to this gallery yet.')}
                    </p>
                    <p className="text-xs text-steel/70">
                      {t(
                        'services.gallery_empty_hint',
                        'Add projects from the admin to populate this gallery.'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.dialog>
      )}
    </AnimatePresence>
  )
}
