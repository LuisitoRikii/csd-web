import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

/* ============================================================
   THICK PAINT-STROKE DIVIDER
   A single thick SVG path that "draws itself" via stroke-dashoffset.
   Inspired by MindMarket's snake-stroke technique.
   ============================================================ */
export const PaintStroke = ({
  path = 'M0,80 C300,20 600,140 900,80 C1100,40 1300,120 1440,60',
  color = '#0B0B12',
  strokeWidth = 80,
  height = 100,
  drawOnScroll = false,
  delay = 0,
  className = '',
  direction = 'right',
}) => {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    if (pathRef.current && drawOnScroll) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [drawOnScroll])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.25'],
  })

  const drawProgress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const smoothed = useSpring(drawProgress, { stiffness: 80, damping: 25 })

  return (
    <div ref={ref} className={`relative w-full overflow-visible ${className}`} style={{ height }}>
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="paintHL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Shadow stroke — slightly offset, darker for wet-paint look */}
        <motion.path
          ref={pathRef}
          d={path}
          fill="none"
          stroke={color}
          strokeOpacity="0.25"
          strokeWidth={strokeWidth + 12}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={direction === 'left' ? 'translate(1440 0) scale(-1 1)' : undefined}
          initial={{ pathLength: drawOnScroll ? 0 : 1 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Main thick stroke */}
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={direction === 'left' ? 'translate(1440 0) scale(-1 1)' : undefined}
          initial={{ pathLength: drawOnScroll ? 0 : 1 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Glossy highlight overlay — shorter, lighter */}
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={strokeWidth * 0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={direction === 'left' ? 'translate(1440 0) scale(-1 1)' : undefined}
          initial={{ pathLength: drawOnScroll ? 0 : 1 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.8, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  )
}

/* ============================================================
   CURVED WAVE DIVIDER
   A large fill-path that creates a soft, wavy section transition.
   ============================================================ */
export const WaveDivider = ({
  fill = '#FAFAF7',
  height = 120,
  position = 'top',
  flip = false,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ height, transform: flip ? 'rotate(180deg)' : undefined }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,120 C240,40 480,40 720,70 C960,100 1200,80 1440,40 L1440,120 Z"
          fill={fill}
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  )
}

/* ============================================================
   SCROLL-DRIVEN BRUSH STROKE (MindMarket signature effect)
   A tall SVG path that "draws" as you scroll. Stroke is thick
   (stroke-linecap="round") so it reads as a fat brush.
   ============================================================ */
export const ScrollBrush = ({
  viewBox = '0 0 800 2400',
  path = 'M400,0 C200,300 700,500 350,800 C0,1100 600,1300 250,1600 C-50,1900 700,2100 400,2400',
  color = '#06B6D4',
  strokeWidth = 60,
  className = '',
}) => {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const [len, setLen] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength())
    }
  }, [path])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25 })
  const dashOffset = useTransform(smooth, [0, 1], [len, 0])
  const translateY = useTransform(smooth, [0, 1], [0, -120])
  const opacity = useTransform(smooth, [0, 0.1, 0.9, 1], [0, 1, 1, 0.3])

  return (
    <div ref={ref} className={`relative w-full ${className}`} aria-hidden="true">
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ y: translateY, opacity }}
      >
        <defs>
          <linearGradient id="scrollBrushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Faded base */}
        <motion.path
          ref={pathRef}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 20}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.12"
        />
        {/* Main thick stroke - draws on scroll */}
        <motion.path
          d={path}
          fill="none"
          stroke={`url(#scrollBrushGrad)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          style={{ strokeDashoffset: dashOffset }}
        />
        {/* Highlight */}
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={strokeWidth * 0.3}
          strokeLinecap="round"
          strokeDasharray={len}
          style={{ strokeDashoffset: dashOffset }}
        />
      </motion.svg>
    </div>
  )
}

/* ============================================================
   BRUSH — REALISTIC SVG with wood handle, metal ferrule, bristles
   ============================================================ */
export const RealisticBrush = ({
  size = 180,
  rotate = -30,
  color = '#0B0B12',
  paintColor = '#06B6D4',
  className = '',
}) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 180 234"
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="woodG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5A3A22" />
        <stop offset="50%" stopColor="#9C6B40" />
        <stop offset="100%" stopColor="#5A3A22" />
      </linearGradient>
      <linearGradient id="ferruleG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3A3A45" />
        <stop offset="30%" stopColor="#9A9AA8" />
        <stop offset="50%" stopColor="#D8D8E0" />
        <stop offset="70%" stopColor="#9A9AA8" />
        <stop offset="100%" stopColor="#3A3A45" />
      </linearGradient>
      <linearGradient id="bristleG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={paintColor} stopOpacity="1" />
        <stop offset="60%" stopColor={paintColor} stopOpacity="0.95" />
        <stop offset="100%" stopColor={paintColor} stopOpacity="0.85" />
      </linearGradient>
      <filter id="brushShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="2" dy="3" result="o"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Wood handle */}
    <rect x="76" y="20" width="28" height="120" rx="14" fill="url(#woodG)" />
    {/* Handle cap */}
    <ellipse cx="90" cy="20" rx="14" ry="4" fill="#3A2418" />

    {/* Metal ferrule */}
    <rect x="70" y="130" width="40" height="40" rx="2" fill="url(#ferruleG)" />
    {/* Ferrule rings */}
    <line x1="70" y1="138" x2="110" y2="138" stroke="#3A3A45" strokeWidth="0.6" opacity="0.6" />
    <line x1="70" y1="146" x2="110" y2="146" stroke="#3A3A45" strokeWidth="0.6" opacity="0.6" />
    <line x1="70" y1="160" x2="110" y2="160" stroke="#3A3A45" strokeWidth="0.6" opacity="0.6" />

    {/* Bristles — tapered, with individual strokes */}
    <path d="M72,168 Q90,200 108,168 L113,175 Q90,235 67,175 Z" fill={color} />
    <path
      d="M72,170 Q90,200 108,170 L112,175 Q90,225 68,175 Z"
      fill="url(#bristleG)"
    />
    {/* Individual bristle lines */}
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 76 + (i / 13) * 28
      return (
        <line
          key={i}
          x1={x}
          y1="172"
          x2={x + (i % 2 === 0 ? -0.5 : 0.5)}
          y2={170 + (i % 4) * 8 + Math.sin(i) * 3}
          stroke={paintColor}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.85"
        />
      )
    })}

    {/* Paint drip */}
    <circle cx="84" cy="222" r="3.5" fill={paintColor} />
    <circle cx="96" cy="222" r="3" fill={paintColor} />
    <ellipse cx="90" cy="226" rx="8" ry="2" fill={paintColor} opacity="0.6" />
  </svg>
)

/* ============================================================
   ROLLER — REALISTIC with frame, foam cover, handle
   ============================================================ */
export const RealisticRoller = ({
  size = 220,
  rotate = 0,
  color = '#FAFAF7',
  paintColor = '#8B5CF6',
  className = '',
}) => (
  <svg
    width={size}
    height={size * 0.55}
    viewBox="0 0 240 132"
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rollerCover" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={paintColor} stopOpacity="0.9" />
        <stop offset="50%" stopColor={paintColor} stopOpacity="1" />
        <stop offset="100%" stopColor={paintColor} stopOpacity="0.9" />
      </linearGradient>
      <pattern id="rollerTexture" width="3" height="20" patternUnits="userSpaceOnUse" x="0" y="0">
        <rect width="3" height="20" fill="rgba(0,0,0,0.06)" />
        <rect x="1.5" width="1.5" height="20" fill="rgba(0,0,0,0)" />
      </pattern>
    </defs>

    {/* Handle / frame */}
    <path
      d="M0,28 L24,28 L26,12 L40,8 L52,12 L56,8 L70,8 L70,14 L74,18 L92,22 Q120,18 130,30 L130,40 L160,40 L160,46 L24,46 L20,40 Z"
      fill="#0B0B12"
      opacity="0.85"
    />
    {/* Handle grip */}
    <rect x="54" y="0" width="14" height="20" rx="3" fill="#0B0B12" />
    <line x1="56" y1="4" x2="66" y2="4" stroke="#3A3A45" strokeWidth="0.6" />
    <line x1="56" y1="9" x2="66" y2="9" stroke="#3A3A45" strokeWidth="0.6" />
    <line x1="56" y1="14" x2="66" y2="14" stroke="#3A3A45" strokeWidth="0.6" />

    {/* Roller cylinder axis caps */}
    <ellipse cx="100" cy="34" rx="6" ry="12" fill="#3A3A45" />
    <ellipse cx="160" cy="34" rx="6" ry="12" fill="#3A3A45" />

    {/* Foam cover */}
    <rect x="100" y="22" width="60" height="24" rx="12" fill="url(#rollerCover)" />
    <rect x="100" y="22" width="60" height="24" rx="12" fill="url(#rollerTexture)" />

    {/* Foam highlight */}
    <rect x="100" y="22" width="60" height="4" rx="2" fill="rgba(255,255,255,0.25)" />

    {/* Paint ribbon coming off */}
    <rect
      x="100"
      y="46"
      width="60"
      height="80"
      fill={paintColor}
      opacity="0.85"
    />
    {/* Wavy edge bottom */}
    <path
      d={`M100,${46 + 80} Q115,${46 + 80 - 8} 130,${46 + 80} T160,${46 + 80} L160,${46 + 80 + 2} L100,${46 + 80 + 2} Z`}
      fill={paintColor}
      opacity="0.4"
    />
  </svg>
)

/* ============================================================
   PAINT BUCKET — REALISTIC with handle, rim, drip
   ============================================================ */
export const RealisticBucket = ({
  size = 160,
  rotate = 0,
  paintColor = '#D946EF',
  className = '',
  withDrip = true,
}) => (
  <svg
    width={size}
    height={size * 1.1}
    viewBox="0 0 180 198"
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bucketBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FAFAF7" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0DCD3" />
      </linearGradient>
      <linearGradient id="bucketShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
      </linearGradient>
      <linearGradient id="paintPool" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={paintColor} />
        <stop offset="100%" stopColor={paintColor} stopOpacity="0.85" />
      </linearGradient>
    </defs>

    {/* Bucket body - trapezoid */}
    <path
      d="M30,52 L150,52 L142,180 L38,180 Z"
      fill="url(#bucketBody)"
      stroke="#0B0B12"
      strokeWidth="2.5"
    />
    <path
      d="M30,52 L150,52 L142,180 L38,180 Z"
      fill="url(#bucketShadow)"
    />

    {/* Rim/Top */}
    <ellipse cx="90" cy="52" rx="60" ry="9" fill="#FAFAF7" stroke="#0B0B12" strokeWidth="2.5" />

    {/* Paint inside (visible from above) */}
    <ellipse cx="90" cy="52" rx="56" ry="7" fill="url(#paintPool)" />
    <ellipse cx="85" cy="50" rx="20" ry="2.5" fill="rgba(255,255,255,0.4)" />

    {/* Metal handle */}
    <path
      d="M30,52 Q90,15 150,52"
      fill="none"
      stroke="#0B0B12"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M30,52 Q90,15 150,52"
      fill="none"
      stroke="#9A9AA8"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
      transform="translate(0 -1)"
    />
    {/* Handle attachment loops */}
    <circle cx="30" cy="52" r="4" fill="#3A3A45" />
    <circle cx="150" cy="52" r="4" fill="#3A3A45" />
    <circle cx="90" cy="18" r="3" fill="#3A3A45" />

    {/* Label band */}
    <rect x="45" y="100" width="90" height="40" rx="3" fill="#FAFAF7" stroke="#0B0B12" strokeWidth="1.5" opacity="0.9" />
    <text
      x="90"
      y="120"
      textAnchor="middle"
      fontSize="11"
      fontFamily="Fraunces, serif"
      fontWeight="600"
      fill="#0B0B12"
      letterSpacing="0.15em"
    >
      CSD
    </text>
    <line x1="60" y1="128" x2="120" y2="128" stroke={paintColor} strokeWidth="1.5" />
    <text
      x="90"
      y="138"
      textAnchor="middle"
      fontSize="5"
      fontFamily="Inter, sans-serif"
      fontWeight="600"
      fill="#3A3A45"
      letterSpacing="0.2em"
    >
      GOOD SERVICES
    </text>

    {/* Drip from rim */}
    {withDrip && (
      <>
        <path
          d="M40,55 Q42,75 41,90 Q40,95 38,95 Q36,90 37,80 Q38,65 38,55 Z"
          fill={paintColor}
          opacity="0.95"
        />
        <ellipse cx="38" cy="96" rx="3" ry="2" fill={paintColor} />

        <path
          d="M138,55 Q140,85 142,110 Q143,115 145,113 Q146,105 144,90 Q142,70 142,55 Z"
          fill={paintColor}
          opacity="0.95"
        />
        <ellipse cx="145" cy="115" rx="3.5" ry="2" fill={paintColor} />
      </>
    )}

    {/* Side highlight */}
    <path
      d="M40,60 L42,170"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)

/* ============================================================
   PAINT DROP — vertical drip shape (used as bg detail)
   ============================================================ */
export const PaintDrop = ({ className = '', size = 120, color = '#06B6D4' }) => (
  <svg viewBox="0 0 100 140" width={size} height={size} className={className} aria-hidden="true">
    <path
      d="M50 0 C50 0 100 60 100 90 C100 117 78 140 50 140 C22 140 0 117 0 90 C0 60 50 0 50 0 Z"
      fill={color}
    />
    <ellipse cx="35" cy="60" rx="10" ry="20" fill="rgba(255,255,255,0.3)" />
  </svg>
)

/* ============================================================
   SPLASH — small splatter shapes (decorative)
   ============================================================ */
export const Splash = ({
  className = '',
  size = 80,
  color = '#D946EF',
  rotate = 0,
  variant = 1,
}) => {
  const variants = {
    1: 'M40 8 L46 30 L60 26 L52 44 L66 50 L48 56 L52 72 L40 60 L28 72 L32 56 L14 50 L28 44 L20 26 L34 30 Z',
    2: 'M40 6 L54 28 L70 22 L60 42 L72 56 L50 52 L46 70 L34 56 L18 60 L22 42 L10 30 L26 26 Z',
    3: 'M30 14 L46 10 L52 26 L66 32 L58 46 L66 60 L48 56 L40 70 L30 56 L18 64 L16 48 L8 38 L24 32 Z',
  }
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <path d={variants[variant] || variants[1]} fill={color} opacity="0.85" />
      <path d={variants[variant] || variants[1]} fill="rgba(255,255,255,0.15)" transform="translate(-2,-2)" />
    </svg>
  )
}

/* ============================================================
   PAINT RIBBON — vertical swatches / color strip
   ============================================================ */
export const PaintRibbon = ({
  height = 600,
  width = 80,
  colors = ['#06B6D4', '#8B5CF6', '#D946EF', '#F97316'],
  className = '',
  rotate = 0,
}) => (
  <svg
    viewBox="0 0 100 800"
    width={width}
    height={height}
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    {colors.map((c, i) => {
      const yStart = (i * 800) / colors.length
      const yEnd = ((i + 1) * 800) / colors.length
      return (
        <path
          key={i}
          d={`M0,${yStart} Q50,${yStart + 30} 100,${yStart} L100,${yEnd} Q50,${yEnd - 30} 0,${yEnd} Z`}
          fill={c}
        />
      )
    })}
  </svg>
)
