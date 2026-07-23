import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Single block that fades up when scrolled into view.
// Use for section titles, hero copy, stand-alone paragraphs.
export const FadeUp = ({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  as = 'div',
  className = '',
  ...rest
}) => {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Component>
  )
}

// Stagger parent: place around a list of `FadeStaggerItem`s to make them
// fade up one after another as the section enters the viewport.
export const FadeStagger = ({
  children,
  staggerDelay = 0.08,
  delayChildren = 0,
  as = 'div',
  className = '',
  ...rest
}) => {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: staggerDelay, delayChildren },
        },
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}

// Stagger child — must live inside a `FadeStagger`.
export const FadeStaggerItem = ({
  children,
  as = 'div',
  className = '',
  y = 20,
  duration = 0.6,
  ...rest
}) => {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: EASE },
        },
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}