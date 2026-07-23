/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tri-color accent system — the only chromatic voices on top of white/black.
        // mint (cool), violet (anchor), magenta (fire) — used as sharp accents,
        // never as page-wide backgrounds.
        mint: {
          DEFAULT: '#91F2D7',
          dark:    '#5BCFAE',
          deep:    '#2DA88A',
          tint:    '#E8FCF6',
        },
        violet: {
          DEFAULT: '#8A04F0',
          dark:    '#6A03BD',
          deep:    '#3D0170',
          light:   '#A535F2',
          tint:    '#F4E8FE',
        },
        magenta: {
          DEFAULT: '#D925A9',
          dark:    '#A91B82',
          deep:    '#6B1152',
          light:   '#E967C2',
          tint:    '#FCEDF6',
        },

        // Surfaces — clean white-dominant canvas, subtle cool grays for rhythm.
        canvas:  '#FFFFFF',
        paper:   '#FFFFFF',
        subtle:  '#F8F9FB',
        muted:   '#F1F3F6',
        ash:     '#EAECEF',

        // Text hierarchy — pure neutral, near-black for max contrast on white.
        ink:      '#000000',
        graphite: '#0A0A0F',
        charcoal: '#1F1F26',
        steel:    '#5A5F6B',
        silver:   '#9CA1AE',
        line:     '#E5E7EB',

        // Backwards-compatible single accent (mapped to violet for cohesion).
        brand: {
          DEFAULT: '#8A04F0',
          dark:    '#6A03BD',
          light:   '#A535F2',
          tint:    '#F4E8FE',
          ink:     '#000000',
        },

        // Status
        ok:   '#16A34A',
        warn: '#D97706',
        err:  '#DC2626',
        info: '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Spectral"', 'Georgia', 'serif'],
        serif: ['"Spectral"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        lato: ['Lato', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7.5vw, 6.5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.4rem, 5.5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.9rem, 4vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.4rem, 2.4vw, 2rem)',   { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'eyebrow': ['0.72rem', { lineHeight: '1.2', letterSpacing: '0.22em' }],
      },
      backgroundImage: {
        // Signature tri-color gradient — locked order: mint → violet → magenta.
        'gradient-spectrum': 'linear-gradient(95deg, #91F2D7 0%, #8A04F0 50%, #D925A9 100%)',
      },
      animation: {
        'marquee': 'marquee 50s linear infinite',
        'marquee-slow': 'marquee 80s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'fade-up': 'fadeUp 0.8s ease-out both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft':   '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
        'lift':   '0 24px 56px -20px rgba(0, 0, 0, 0.18)',
        'card':   '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 2px 4px 0 rgba(0, 0, 0, 0.05), 0 16px 40px -12px rgba(0, 0, 0, 0.14)',
        // Subtle tri-color glows — used sparingly to support the sober palette.
        'glow-mint':    '0 12px 28px -10px rgba(145, 242, 215, 0.55)',
        'glow-vibe':    '0 14px 36px -12px rgba(138, 4, 240, 0.38), 0 10px 24px -10px rgba(217, 37, 169, 0.30)',
        'focus':        '0 0 0 3px rgba(138, 4, 240, 0.28)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        'container': '1440px',
        'reading': '640px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
