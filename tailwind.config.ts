import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1B3D',
          50: '#EEF0F7',
          100: '#D6DBEA',
          200: '#AEB7D4',
          300: '#8592BE',
          400: '#5D6DA8',
          500: '#3C4B87',
          600: '#28356A',
          700: '#1B264F',
          800: '#16244C',
          900: '#0F1B3D',
          950: '#0A0F1F',
        },
        gold: {
          DEFAULT: '#C9A65C',
          50: '#FBF6EB',
          100: '#F3E7C9',
          200: '#E7D097',
          300: '#DBB96A',
          400: '#C9A65C',
          500: '#B08C42',
          600: '#8C6E33',
          700: '#6A5227',
          800: '#493A1C',
          900: '#2C2310',
        },
        paper: '#F7F5F0',
        slate: {
          ink: '#4B5568',
        },
      },
      fontFamily: {
        sans: ['"Tajawal"', '"IBM Plex Sans Arabic"', '"Inter"', 'sans-serif'],
        display: ['"Tajawal"', '"IBM Plex Sans Arabic"', '"Inter"', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
      },
      boxShadow: {
        soft: '0 1px 0 0 rgba(15, 27, 61, 0.06)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        awardsSweep: {
          '0%': { left: '-50%', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { left: '130%', opacity: '0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease forwards',
        awardsSweep: 'awardsSweep 0.9s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
