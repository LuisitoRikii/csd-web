import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * BeforeAfterSlider — interactive drag-to-reveal slider.
 * Uses CSS clip-path on the "after" image to reveal proportionally.
 */
export const BeforeAfterSlider = ({ before, after, beforeLabel, afterLabel, className = '' }) => {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = useCallback((clientX) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPos(p)
  }, [])

  const onPointerDown = (e) => {
    setDragging(true)
    updateFromClientX(e.clientX)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    updateFromClientX(e.clientX)
  }
  const onPointerUp = () => setDragging(false)

  // Also support keyboard for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (!trackRef.current?.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 2))
      if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 2))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl select-none bg-subtle swiper-no-swiping ${className}`}
      style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
      onClick={(e) => updateFromClientX(e.clientX)}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* BEFORE — full background */}
      <img
        src={before}
        alt={beforeLabel || 'Before'}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        draggable={false}
        loading="lazy"
        style={{ WebkitUserDrag: 'none', userDrag: 'none', pointerEvents: 'none' }}
      />
      <span className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-ink/85 backdrop-blur-sm text-paper text-[10px] tracking-[0.2em] uppercase">
        {beforeLabel || 'Before'}
      </span>

      {/* AFTER — clipped on the right side, revealed by the handle */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 0 0 ${pos}%)`, touchAction: 'none' }}
      >
        <img
          src={after}
          alt={afterLabel || 'After'}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          style={{ WebkitUserDrag: 'none', userDrag: 'none', pointerEvents: 'none' }}
        />
      </div>
      <span
        className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-paper/95 backdrop-blur-sm text-ink text-[10px] tracking-[0.2em] uppercase"
      >
        {afterLabel || 'After'}
      </span>

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-px bg-paper pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-paper shadow-lift flex items-center justify-center text-ink pointer-events-auto">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 10L2 10M2 10L5 7M2 10L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 10L18 10M18 10L15 7M18 10L15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="absolute inset-0 z-30 cursor-ew-resize touch-none"
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-label={`${beforeLabel || 'Before'} and ${afterLabel || 'After'} comparison`}
      />
    </div>
  )
}
