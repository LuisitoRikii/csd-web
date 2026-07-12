import { useEffect, useState } from 'react'

/**
 * CustomCursor — a morphing artistic cursor that turns into a
 * paint drop / brush dot / brush bristle when interacting.
 */
export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [variant, setVariant] = useState('default')
  const [visible, setVisible] = useState(false)
  const [trail, setTrail] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setVisible(true)

    let lastMove = 0
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Throttle trail updates
      const now = Date.now()
      if (now - lastMove > 60) {
        lastMove = now
        setTrail((prev) => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id: now }])
      }
    }

    const handleOver = (e) => {
      const target = e.target
      if (target.closest('a, button, [data-cursor="link"]')) {
        setVariant('link')
      } else if (target.closest('img, figure, [data-cursor="image"]')) {
        setVariant('image')
      } else if (target.closest('[data-cursor="drip"]')) {
        setVariant('drip')
      } else {
        setVariant('default')
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', handleOver)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [])

  if (!visible) return null

  const sizes = {
    default: { size: 8, ring: 36 },
    link: { size: 0, ring: 64 },
    image: { size: 12, ring: 88 },
    drip: { size: 0, ring: 56 },
  }

  const s = sizes[variant]

  return (
    <>
      {/* Trail of fading dots */}
      {trail.map((p, i) => (
        <div
          key={p.id}
          className="custom-cursor fixed pointer-events-none z-[9997] rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: 4 + i * 0.6,
            height: 4 + i * 0.6,
            transform: 'translate(-50%, -50%)',
            background: variant === 'link' ? '#06B6D4' : variant === 'image' ? '#D946EF' : '#8B5CF6',
            opacity: 0.15 + i * 0.06,
            transition: 'opacity 0.6s, width 0.4s, height 0.4s',
          }}
        />
      ))}

      {/* Outer morphing ring */}
      <div
        className="custom-cursor fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          width: s.ring,
          height: s.ring,
          border: `2px solid ${
            variant === 'link' ? '#06B6D4' :
            variant === 'image' ? '#D946EF' :
            variant === 'drip' ? '#06B6D4' :
            '#0B0B12'
          }`,
          borderRadius: '9999px',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1), height 0.4s cubic-bezier(0.22,1,0.36,1), border-radius 0.3s, border 0.3s',
          opacity: variant === 'default' ? 0.35 : 0.85,
        }}
      />

      {/* Center dot — only in default variant */}
      {s.size > 0 && (
        <div
          className="custom-cursor fixed pointer-events-none z-[10000]"
          style={{
            left: position.x,
            top: position.y,
            width: s.size,
            height: s.size,
            background: '#0B0B12',
            borderRadius: '9999px',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.3s, height 0.3s',
          }}
        />
      )}

      {/* Image variant — show a paint drop */}
      {variant === 'image' && (
        <div
          className="custom-cursor fixed pointer-events-none z-[9999]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%) rotate(-15deg)',
          }}
        >
          <svg width="40" height="52" viewBox="0 0 80 110" aria-hidden="true">
            <defs>
              <linearGradient id="dropG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <path
              d="M40 0 C40 0 75 50 75 75 C75 95 60 110 40 110 C20 110 5 95 5 75 C5 50 40 0 40 0 Z"
              fill="url(#dropG)"
            />
            <ellipse cx="28" cy="55" rx="8" ry="14" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>
      )}

      {/* Link variant — small SVG brush */}
      {variant === 'link' && (
        <div
          className="custom-cursor fixed pointer-events-none z-[9999]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%) rotate(45deg)',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 60 60" aria-hidden="true">
            <rect x="22" y="0" width="16" height="36" rx="6" fill="#5A3A22" />
            <rect x="18" y="32" width="24" height="10" fill="#9A9AA8" />
            <path d="M18,40 L42,40 L38,58 L22,58 Z" fill="#06B6D4" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={20 + i * 2} y1="40" x2={21 + i * 2} y2="56" stroke="#06B6D4" strokeWidth="0.7" opacity="0.6" />
            ))}
          </svg>
        </div>
      )}

      {/* Drip variant */}
      {variant === 'drip' && (
        <div
          className="custom-cursor fixed pointer-events-none z-[9999]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-3 h-3 rounded-full bg-cyan animate-pulse" />
        </div>
      )}
    </>
  )
}
