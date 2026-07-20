/**
 * Sober line-icons used across sections — thin strokes, no fills.
 * Each icon inherits `currentColor`, no decorative SVG/illustration styling.
 */
const baseProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Consultation = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
  </svg>
)

export const Document = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
    <line x1="9" y1="9" x2="11" y2="9" />
  </svg>
)

export const Construction = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
    <path d="M12 14V4l4 2-2 2 2 2-4 0" />
  </svg>
)

export const Key = (p) => (
  <svg {...baseProps} {...p}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3 3-3" />
  </svg>
)

export const Hammer = (p) => (
  <svg {...baseProps} {...p}>
    <path d="m15 12-8.5 8.5a2 2 0 0 1-2.8 0l-5.7-5.7a2 2 0 0 1 0-2.8L6.5 4" />
    <path d="m17.5 4.5 2 2" />
    <path d="m19 3 2 2" />
    <path d="M14 6l4-4 4 4-4 4-1.5-1.5" />
  </svg>
)

export const PaintBucket = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M19 11h2v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8h2" />
    <path d="M5 11V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
    <path d="M5 11h14l-1.5-5h-11z" />
  </svg>
)

export const LayoutGrid = (p) => (
  <svg {...baseProps} {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

export const Wrench = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

export const Bath = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.7 3 4 3.7 4 4.5V17a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6z" />
    <line x1="10" y1="5" x2="8" y2="7" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
)

export const ChefHat = (p) => (
  <svg {...baseProps} {...p}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
)
