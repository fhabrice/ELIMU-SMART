import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Bleu institutionnel SMART-ELIMU (inspiré du ciel de la RDC)
        elimu: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a5ff',
          500: '#3282fb',
          600: '#1c60f0',
          700: '#154bdc',
          800: '#173eb2',
          900: '#0d2a6b',
          950: '#0a1c45',
        },
        // Or / jaune du drapeau
        gold: {
          50: '#fffbeb',
          100: '#fff4c6',
          200: '#ffe888',
          300: '#ffd64a',
          400: '#fdc320',
          500: '#f7a207',
          600: '#db7b02',
          700: '#b65706',
          800: '#943f0c',
          900: '#7a350d',
        },
        // Rouge du drapeau — uniquement pour alertes / accents
        rdc: {
          red: '#CE1126',
          yellow: '#FCD116',
          blue: '#007FFF',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,42,107,0.06), 0 8px 24px -12px rgba(13,42,107,0.18)',
        pop: '0 24px 48px -24px rgba(13,42,107,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
