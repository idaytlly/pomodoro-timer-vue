/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{html,js}",
    "./src/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#FF69B4',
          blue: '#6EC5E9',
          purple: '#B19CD9',
          green: '#77DD77',
          yellow: '#FFD700',
          orange: '#FFA500'
        },
        dark: {
          bg: '#1a1a2e',
          card: '#2d2d44'
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 105, 180, 0.8)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}