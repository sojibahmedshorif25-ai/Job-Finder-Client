/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          350: '#b6a5f5',
          400: '#a78bfa',
          450: '#996df0',
          500: '#8b5cf6', // Main primary purple
          550: '#7e4eed',
          600: '#7c3aed',
          650: '#6e2ed6',
          700: '#6d28d9',
          750: '#5f22c4',
          800: '#5b21b6',
          850: '#4d1aa0',
          900: '#4c1d95',
          950: '#3b1580',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          350: '#abb5c9',
          400: '#9ca3af',
          450: '#94a3b8',
          500: '#64748b',
          550: '#55657b',
          600: '#475569',
          650: '#3a4a5f',
          700: '#334155',
          750: '#2a3648',
          800: '#1e293b',
          850: '#152032',
          900: '#0f172a', // Deep dark page background
          905: '#0b1125',
          950: '#020617', // Darker background
        },
        slate: {
          350: '#cbd5e1',
          450: '#94a3b8',
          550: '#64748b',
          650: '#475569',
          750: '#334155',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
