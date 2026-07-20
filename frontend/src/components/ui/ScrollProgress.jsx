import { motion, useScroll, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * ScrollProgress — fixed 2px line at the top that fills as the page scrolls.
 */
export function ScrollProgress({ color = '#770BBF', className = '' }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  })
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <motion.div
      aria-hidden
      className={`fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] pointer-events-none ${className}`}
      style={{ background: color, scaleX }}
    />
  )
}
