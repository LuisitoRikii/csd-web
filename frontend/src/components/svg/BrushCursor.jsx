import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * BrushCursor — a custom SVG brush that follows scroll progress,
 * leaving an organic paint stroke behind it. Used to create
 * scroll-storytelling transitions between sections.
 */
export const BrushCursor = ({ height = 1200, color = '#0B0B12', className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
  })

  const x = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const y = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [-8, 4, -8])

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className="absolute inset-0 pointer-events-none">
        {/* Paint trail — a sweeping stroke */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M 0 50 Q 25 20, 50 50 T 100 50"
            stroke={color}
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
        </svg>

        {/* Brush head */}
        <motion.div
          className="absolute"
          style={{
            left: x,
            top: y,
            rotate,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <linearGradient id="bristle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <rect x="44" y="40" width="32" height="40" rx="4" fill="#FAFAF7" stroke={color} strokeWidth="1.5" />
            <g>
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={50 + (i % 4) * 6}
                  y1="20"
                  x2={50 + (i % 4) * 6 + (i < 6 ? -4 : 4)}
                  y2="40"
                  stroke="url(#bristle)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              ))}
            </g>
            <rect x="48" y="78" width="24" height="6" rx="2" fill={color} />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

/**
 * DripFill — fills the viewport from a vertical drip
 */
export const DripFill = ({ color = '#06B6D4', className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 0.7], [0, 1])
  const fillOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1])

  return (
    <div ref={ref} className={`relative h-[60vh] ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M720 0 C720 0 700 200 720 400 C740 600 720 600 720 600 C720 600 700 600 720 400 C740 200 720 0 720 0 Z"
          fill={color}
          style={{ pathLength, opacity: fillOpacity }}
        />
      </svg>
    </div>
  )
}
