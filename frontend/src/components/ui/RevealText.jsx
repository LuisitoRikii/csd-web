import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * RevealText — word or char-stagger reveal.
 *
 *   <RevealText as="h2" text="Hello world" split="words" />
 *   <RevealText text="Title" split="chars" staggerChildren={0.025} />
 */
export function RevealText({
  as: Tag = 'span',
  text = '',
  split = 'words',
  delay = 0,
  staggerChildren = 0.05,
  className = '',
  once = true,
  viewportMargin = '-60px',
}) {
  const reduced = useReducedMotion()

  if (reduced || !text) {
    return <Tag className={className}>{text}</Tag>
  }

  const tokens =
    split === 'chars' ? Array.from(text) : text.split(/(\s+)/)
  const visible = split === 'words' ? tokens.filter((t) => /\S/.test(t)) : tokens
  const lastIndex = visible.length - 1

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren: delay },
    },
  }
  const childVariants = {
    hidden: { y: '110%' },
    show: {
      y: '0%',
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: viewportMargin }}
        variants={containerVariants}
        className="inline-block"
      >
        {visible.map((t, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: '0.08em' }}
          >
            <motion.span variants={childVariants} className="inline-block">
              {split === 'words'
                ? `${t}${i < lastIndex ? '\u00A0' : ''}`
                : (t === ' ' ? '\u00A0' : t)}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
