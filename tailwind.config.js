/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#154A8F',
          dark: '#0D2545',
          light: '#EAF2FA',
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAD9FF',
          300: '#7DBCFF',
          400: '#3A9BFF',
          500: '#1578E8',
          600: '#154A8F',
          700: '#0D2545',
          800: '#0A1C35',
          900: '#07121F',
        },
        accent: {
          red: '#D43224',
          'red-light': '#FEE8E7',
          orange: '#F28C28',
          'orange-light': '#FEF3E5',
          yellow: '#DBA925',
          'yellow-light': '#FDF5DC',
          green: '#1E8A3A',
          'green-light': '#E6F5EA',
        },
        tristarc: {
          bg: '#F5F8FC',
          'bg-alt': '#EEF4F9',
          border: '#DCE4EC',
          'text-primary': '#172033',
          'text-secondary': '#526174',
          'text-muted': '#7A8798',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-md': ['3rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        'content': '1280px',
        'wide': '1440px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(21,74,143,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(21,74,143,0.12)',
        'nav': '0 2px 16px rgba(21,74,143,0.08)',
        'mega': '0 8px 40px rgba(21,74,143,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        'header': '0 2px 8px rgba(21,74,143,0.10)',
        'modal': '0 24px 80px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D2545 0%, #154A8F 50%, #1578E8 100%)',
        'hero-overlay': 'linear-gradient(135deg, rgba(13,37,69,0.95) 0%, rgba(21,74,143,0.90) 100%)',
        'section-gradient': 'linear-gradient(180deg, #F5F8FC 0%, #EEF4F9 100%)',
        'blue-gradient': 'linear-gradient(135deg, #154A8F 0%, #1578E8 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F28C28 0%, #DBA925 100%)',
        'card-hover-gradient': 'linear-gradient(135deg, #EAF2FA 0%, #F0F7FF 100%)',
        'data-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23154A8F' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
