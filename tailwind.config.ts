import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mystical theme - 王者荣耀世界观风格
        dark: {
          900: '#050810',
          800: '#0A0E1A',
          700: '#0F1525',
          600: '#161C30',
          500: '#1E2640',
          400: '#263050',
        },
        gold: {
          DEFAULT: '#D4A017',
          light: '#F0C040',
          dark: '#A07810',
          muted: '#8A6010',
        },
        jade: {
          DEFAULT: '#1A8A5A',
          light: '#2AAA70',
          dark: '#126040',
        },
        crimson: {
          DEFAULT: '#C02030',
          light: '#E03050',
          dark: '#801020',
        },
        azure: {
          DEFAULT: '#1A5A8A',
          light: '#2A7AAA',
          dark: '#123060',
        },
        parchment: {
          DEFAULT: '#E8DCC8',
          dark: '#C8BCA8',
          light: '#F8F0E0',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        display: ['var(--font-display)', 'STKaiti', 'KaiTi', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/bg-pattern.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #050810 0%, #0A0E1A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4A017 0%, #F0C040 50%, #A07810 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 160, 23, 0.3)',
        'gold-sm': '0 0 8px rgba(212, 160, 23, 0.2)',
        'inner-dark': 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 160, 23, 0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(212, 160, 23, 0.15)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
