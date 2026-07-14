// src/components/svg/PaintRevealSection.jsx
import { useEffect, useRef, useState } from 'react'

const DRIPS_DATA = [
  { x: 90,  w: 30, h: 70 },
  { x: 122, w: 16, h: 38 },
  { x: 142, w: 24, h: 92 },
  { x: 170, w: 15, h: 34 },
  { x: 188, w: 30, h: 105 },
  { x: 222, w: 18, h: 52 },
  { x: 244, w: 26, h: 88 },
  { x: 274, w: 16, h: 42 },
  { x: 294, w: 26, h: 72 },
]

const EDGE_POINTS = [
  { x: 90,  y: 0 }, { x: 105, y: 6 }, { x: 121, y: -10 }, { x: 130, y: 6 },
  { x: 140, y: -10 }, { x: 154, y: 6 }, { x: 168, y: -10 }, { x: 177, y: 6 },
  { x: 186, y: -10 }, { x: 203, y: 6 }, { x: 220, y: -10 }, { x: 231, y: 6 },
  { x: 242, y: -10 }, { x: 257, y: 6 }, { x: 272, y: -10 }, { x: 282, y: 6 },
  { x: 292, y: -10 }, { x: 307, y: 6 }, { x: 320, y: 0 },
]

const VIEWBOX_W = 400
const VIEWBOX_H = 800
const BRUSH_HEIGHT = 385
const OVERLAP = 15

function buildPaintPath(paintH) {
  const TOP = -2000
  let d = `M ${EDGE_POINTS[0].x} ${TOP} L ${EDGE_POINTS[0].x} ${paintH + EDGE_POINTS[0].y} `
  for (let i = 1; i < EDGE_POINTS.length; i++) {
    d += `L ${EDGE_POINTS[i].x} ${paintH + EDGE_POINTS[i].y} `
  }
  const last = EDGE_POINTS[EDGE_POINTS.length - 1]
  d += `L ${last.x} ${TOP} Z`
  return d
}

function buildDripPath(d, h) {
  const r = d.w / 2
  return `M ${d.x} 0 H ${d.x + d.w} V ${h - r} Q ${d.x + d.w} ${h} ${d.x + d.w / 2} ${h} Q ${d.x} ${h} ${d.x} ${h - r} Z`
}

/**
 * Sección pineada: el fondo pintado (idéntico al demo) queda `sticky` mientras
 * dura todo el scroll de los children, que se renderizan superpuestos encima
 * (con marginTop: -100vh) en flujo normal.
 *
 * Uso:
 *   <PaintRevealSection>
 *     <About />
 *     <Services />
 *   </PaintRevealSection>
 */
export const PaintRevealSection = ({
  children,
  stripeColorA = '#f6d631',
  stripeColorB = '#ecc928',
  paintColor = '#e42a72',
  overlayOpacity = 0.35, // scrim oscuro entre fondo y contenido, para legibilidad
  className = '',
}) => {
  const wrapRef = useRef(null)
  const [paintH, setPaintH] = useState(0)

  useEffect(() => {
    let ticking = false
    const totalTravel = VIEWBOX_H - BRUSH_HEIGHT - 40

    const update = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      let p = scrollable > 0 ? (-rect.top) / scrollable : 0
      p = Math.min(1, Math.max(0, p))
      setPaintH(p * totalTravel)
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false })
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Fondo pintado, pineado mientras dura el recorrido de los children */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ zIndex: 0 }}>
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full block"
        >
          <defs>
            <pattern id="prs-stripes" width="40" height="8" patternUnits="userSpaceOnUse">
              <rect width="40" height="8" fill={stripeColorA} />
              <rect width="40" height="2" y="3" fill={stripeColorB} />
            </pattern>
          </defs>

          <rect x="0" y="0" width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#prs-stripes)" />

          <g style={{ filter: 'drop-shadow(6px 6px 0px rgba(150,120,10,0.35))' }}>
            <path d={buildPaintPath(paintH)} fill={paintColor} />
            <g transform={`translate(0, ${paintH})`}>
              {DRIPS_DATA.map((d, i) => (
                <g key={i}>
                  <path d={buildDripPath(d, d.h)} fill={paintColor} />
                  <line
                    x1={d.x + d.w * 0.32} y1={8}
                    x2={d.x + d.w * 0.32 + 6} y2={Math.max(d.h - 14, 14)}
                    stroke="#ffffff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round"
                  />
                </g>
              ))}
            </g>
          </g>

          <g
            transform={`translate(0, ${paintH - OVERLAP})`}
            style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.25))' }}
          >
            <rect x="100" y="0" width="200" height="140" fill="#ffffff" />
            {Array.from({ length: 15 }).map((_, i) => {
              const x = 100 + i * (200 / 14)
              return <line key={i} x1={x} y1={8} x2={x - 10} y2={132} stroke="#c9c9c9" strokeWidth="2" />
            })}
            <rect x="95" y="140" width="210" height="28" fill="#b7b7b7" />
            <rect x="95" y="149" width="210" height="3" fill="#8f8f8f" />
            <rect x="95" y="158" width="210" height="3" fill="#8f8f8f" />
            <path
  d="M 98 168
     L 302 168
     Q 288 172 268 176
     Q 248 180 244 190
     L 244 282
     Q 244 291 258 297
     Q 278 305 282 325
     Q 285 344 270 358
     Q 254 370 200 372
     Q 146 370 130 358
     Q 115 344 118 325
     Q 122 305 142 297
     Q 156 291 156 282
     L 156 190
     Q 152 180 132 176
     Q 112 172 98 168
     Z"
  fill="#3b2a1e"
/>
<circle cx="200" cy="340" r="15" fill={stripeColorA} />
          </g>
        </svg>

        {/* Scrim para que el texto encima sea legible sobre cualquier zona del fondo */}
        <div
          className="absolute inset-0"
          style={{ background: `rgba(10,10,12,${overlayOpacity})`, zIndex: 1 }}
        />
      </div>

      {/* Contenido real, superpuesto al fondo pineado */}
      <div className="relative z-10" style={{ marginTop: '-100vh' }}>
        {children}
      </div>
    </div>
  )
}