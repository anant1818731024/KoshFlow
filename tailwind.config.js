/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm neutral "ink & paper" foundation
        ink: {
          50: '#f6f5f3',
          100: '#e9e7e2',
          200: '#d5d1c8',
          300: '#b7b0a2',
          400: '#928a79',
          500: '#756d5d',
          600: '#5d5648',
          700: '#4a453b',
          800: '#403b34',
          900: '#38342e',
          950: '#1c1a16',
        },
        // Deep, restrained emerald — the single brand accent
        accent: {
          50: '#edf7f3',
          100: '#d3ebe0',
          200: '#a9d6c4',
          300: '#76bba2',
          400: '#489a80',
          500: '#2f7d66',
          600: '#236453',
          700: '#1e5043',
          800: '#1b4037',
          900: '#183530',
          950: '#0b1e1b',
        },
        // Muted gold — used sparingly for verification / premium marks
        gold: {
          50: '#faf6ed',
          100: '#f2e7c9',
          200: '#e6d095',
          300: '#d9b662',
          400: '#cfa03f',
          500: '#bd8730',
          600: '#a06b28',
          700: '#805024',
          800: '#6a4023',
          900: '#5a3620',
        },
        positive: {
          50: '#edf7f3',
          500: '#2f7d66',
          600: '#236453',
          700: '#1e5043',
        },
        negative: {
          50: '#fbeeeb',
          500: '#c05a45',
          600: '#a4432f',
          700: '#8a3626',
        },
        warn: {
          50: '#fdf4e7',
          500: '#c98a2b',
          600: '#a76e1f',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(28 26 22 / 0.04), 0 1px 3px 0 rgb(28 26 22 / 0.06)',
        elevated:
          '0 4px 6px -2px rgb(28 26 22 / 0.05), 0 12px 24px -8px rgb(28 26 22 / 0.12)',
        overlay:
          '0 8px 12px -4px rgb(28 26 22 / 0.08), 0 24px 48px -12px rgb(28 26 22 / 0.22)',
        focus: '0 0 0 3px rgb(47 125 102 / 0.16)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'flash-highlight': {
          '0%': { backgroundColor: 'rgb(237 247 243)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-in': 'toast-in 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
        'flash-highlight': 'flash-highlight 1.6s ease-out',
      },
    },
  },
  plugins: [],
}
