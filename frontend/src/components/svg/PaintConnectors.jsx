// src/components/svg/PaintConnectors.jsx
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

const VIEWBOX_H = 800
const VIEWBOX_W = 400
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
 * Pincelada vertical — misma forma exacta que el demo original.
 * La velocidad de pintado queda atada al scroll real vía `scrollRatio`,
 * así que cambiar `travel` (cuánto baja) NO desincroniza el efecto:
 * el scroll necesario para completarlo escala junto con el recorrido.
 */
export const VerticalBrushConnector = ({
  travel = 520,           // recorrido visual, en unidades del viewBox (0-800)
  topOffset = -380,
  width = 260,
  color = '#e42a72',
  handleColor = '#3b2a1e',
  metalColor = '#b7b7b7',
  opacity = 0.9,
  align = 'center',
  offsetX = 0,
  // cuántos px de scroll hacen falta por cada px visual del trazo.
  // Subilo si lo sentís muy rápido/desincronizado, bajalo si lo sentís lento.
  scrollRatio = 2.1,
  className = '',
}) => {
  const wrapRef = useRef(null)
  const [paintH, setPaintH] = useState(0)

  useEffect(() => {
    let ticking = false
    const cssPerViewbox = width / VIEWBOX_W
    const visualTravelPx = travel * cssPerViewbox
    const scrollWindow = visualTravelPx * scrollRatio // px de scroll para completar el trazo

    const update = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.95 // punto de scroll donde empieza a pintar
      let p = (start - rect.top) / scrollWindow
      p = Math.min(1, Math.max(0, p))
      setPaintH(p * travel)
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
  }, [travel, width, scrollRatio])

  const renderHeight = width * (VIEWBOX_H / VIEWBOX_W)

  const alignStyle =
    align === 'left' ? { left: '4%' } :
    align === 'right' ? { right: '4%' } :
    { left: `calc(50% + ${offsetX}%)`, transform: 'translateX(-50%)' }

  const brushOpacity = Math.min(1, paintH / 20)

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ top: topOffset, width, height: renderHeight, opacity, ...alignStyle }}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width={width}
        height={renderHeight}
        style={{ overflow: 'visible' }}
      >
        <g style={{ filter: 'drop-shadow(6px 6px 8px rgba(0,0,0,0.35))' }}>
          <path d={buildPaintPath(paintH)} fill={color} />
          <g transform={`translate(0, ${paintH})`}>
            {DRIPS_DATA.map((d, i) => (
              <g key={i}>
                <path d={buildDripPath(d, d.h)} fill={color} />
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
          style={{ filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.3))', opacity: brushOpacity }}
        >
          <rect x="100" y="0" width="200" height="140" fill="#ffffff" />
          {Array.from({ length: 15 }).map((_, i) => {
            const x = 100 + i * (200 / 14)
            return <line key={i} x1={x} y1={8} x2={x - 10} y2={132} stroke="#c9c9c9" strokeWidth="2" />
          })}

          <rect x="95" y="140" width="210" height="28" fill={metalColor} />
          <rect x="95" y="149" width="210" height="3" fill="#8f8f8f" />
          <rect x="95" y="158" width="210" height="3" fill="#8f8f8f" />

          <path
            d="M 100 168
               L 300 168
               L 300 320
               Q 300 380 240 385
               L 160 385
               Q 100 380 100 320
               Z"
            fill={handleColor}
          />
          <circle cx="200" cy="345" r="20" fill="none" stroke={metalColor} strokeWidth="4" opacity="0.5" />
        </g>
      </svg>
    </div>
  )
}

export const TippedBucketDrip = ({
  color = '#F97316',
  side = 'right',
  size = 84,
  opacity = 0.13,
  className = '',
}) => {
  const sideStyle = side === 'left' ? { left: '4%' } : { right: '4%' }
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 z-0 ${className}`}
      style={{ width: size, opacity, ...sideStyle }}
    >
      <svg viewBox="0 0 90 90" width={size} height={size}>
        <ellipse cx="45" cy="80" rx="24" ry="5" fill={color} opacity="0.5" />
        <path d="M20 40 L64 34 L60 58 Q58 66 46 66 L30 64 Q20 62 20 52 Z" fill="#9a9a9a" />
        <path d="M20 40 L64 34" stroke="#7a7a7a" strokeWidth="2" fill="none" />
        <path d="M58 50 Q70 54 74 66 Q76 74 66 76 Q56 78 54 68 Q52 58 58 50 Z" fill={color} />
      </svg>
    </div>
  )
}