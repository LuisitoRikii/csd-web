import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * ScrollPaintCanvas — the signature MindMarket-inspired effect.
 *
 * A tall SVG with thick rounded strokes (like a giant paint brush).
 * As the user scrolls down its container, the stroke "draws" itself.
 * The brush head (or roller) follows the cursor's path, leaving
 * organic thick strokes behind it.
 *
 * Usage: <ScrollPaintCanvas height={1200} colors={{...}} />
 */
export const ScrollPaintCanvas = ({
  height = 1400,
  strokeWidth = 70,
  path = 'M 400 0 C 250 200, 600 350, 350 550 C 100 750, 650 900, 250 1100 C -50 1300, 600 1450, 400 1600',
  viewBox = '0 0 800 1600',
  colors = {
    main: '#06B6D4',
    shadow: '#0E7490',
    highlight: 'rgba(255,255,255,0.3)',
  },
  brush = 'brush',
  showBrush = true,
  className = '',
}) => {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const [len, setLen] = useState(1)

  useEffect(() => {
    if (pathRef.current && typeof window !== 'undefined') {
      try {
        setLen(pathRef.current.getTotalLength())
      } catch {
        setLen(1)
      }
    }
  }, [path])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.1'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26 })
  const dashOffset = useTransform(smooth, [0, 1], [len, -len * 0.5])
  const y = useTransform(smooth, [0, 1], ['0%', '-10%'])

  return (
    <div
      ref={ref}
      className={`relative w-full pointer-events-none ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ y }}
      >
        <defs>
          <linearGradient id="spcMain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.main} stopOpacity="0.95" />
            <stop offset="100%" stopColor={colors.main} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="spcShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.shadow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.shadow} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Soft outer glow */}
        <motion.path
          ref={pathRef}
          d={path}
          fill="none"
          stroke={colors.main}
          strokeOpacity="0.1"
          strokeWidth={strokeWidth + 30}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Shadow stroke */}
        <motion.path
          d={path}
          fill="none"
          stroke={`url(#spcShadow)`}
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          style={{ strokeDashoffset: dashOffset }}
        />
        {/* Main thick stroke — draws as you scroll */}
        <motion.path
          d={path}
          fill="none"
          stroke={`url(#spcMain)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          style={{ strokeDashoffset: dashOffset }}
        />
        {/* Glossy highlight on top */}
        <motion.path
          d={path}
          fill="none"
          stroke={colors.highlight}
          strokeWidth={strokeWidth * 0.32}
          strokeLinecap="round"
          strokeDasharray={len}
          style={{ strokeDashoffset: dashOffset }}
        />
      </motion.svg>
    </div>
  )
}

/**
 * BrushPointer — the brush head that follows the scroll path.
 * Driven by motion values that match the dashOffset progress.
 */
export const ScrollBrushPointer = ({
  height = 800,
  path = 'M 200 0 C 100 200, 350 350, 150 600 C -50 800, 300 900, 200 1100',
  viewBox = '0 0 400 1100',
  color = '#FAFAF7',
  bristleColor = '#06B6D4',
  className = '',
}) => {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const [point, setPoint] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (pathRef.current) {
      const total = pathRef.current.getTotalLength()
      // We sample at progress = 0.1 (near top)
      const p = pathRef.current.getPointAtLength(total * 0.1)
      setPoint({ x: p.x, y: p.y })
    }
  }, [path])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.1'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26 })

  // Track the brush along the path — convert progress to point on path
  useEffect(() => {
    if (!pathRef.current) return
    const total = pathRef.current.getTotalLength()
    const unsub = smooth.on('change', (v) => {
      const cur = pathRef.current.getPointAtLength(total * v)
      setPoint({ x: cur.x, y: cur.y })
    })
    return () => unsub()
  }, [smooth])

  return (
    <div
      ref={ref}
      className={`relative w-full pointer-events-none ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={viewBox}
        preserveAspectRatio="none"
      >
        <defs>
          <path id="brushPath" ref={pathRef} d={path} fill="none" stroke="none" />
        </defs>

        <motion.g
          animate={{
            x: point.x,
            y: point.y,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* Brush orientation — calculate angle from previous point */}
          <g transform="translate(-30 -40) rotate(20 30 40)">
            {/* Wood handle */}
            <rect x="22" y="14" width="12" height="40" rx="6" fill="#5A3A22" />
            {/* Ferrule */}
            <rect x="18" y="46" width="20" height="14" rx="1.5" fill="#9A9AA8" />
            {/* Bristles */}
            <path d="M16,58 L40,58 L37,82 L19,82 Z" fill={bristleColor} />
            {/* Bristle lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line
                key={i}
                x1={20 + i * 2}
                y1="58"
                x2={21 + i * 2}
                y2="80"
                stroke={bristleColor}
                strokeOpacity="0.5"
                strokeWidth="0.6"
              />
            ))}
            {/* Highlight */}
            <rect x="22" y="16" width="3" height="36" rx="1" fill="#9C6B40" opacity="0.6" />
          </g>
        </motion.g>
      </svg>
    </div>
  )
}
