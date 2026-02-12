/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 🍬 CANDY COLORS - Dark theme accents
        candy: {
          pink: '#FF69B4',
          'pink-dark': '#FF1493',
          'pink-light': '#FFB6C1',
          blue: '#6EC5E9',
          'blue-dark': '#4A9FCC',
          purple: '#B19CD9',
          'purple-dark': '#9370DB',
          green: '#77DD77',
          'green-dark': '#50C878',
          yellow: '#FFD700',
          orange: '#FFB347',
        },
        // 🌑 DARK THEME BACKGROUNDS
        dark: {
          100: '#1a1a2e', // Deep navy - primary bg
          200: '#16213e', // Darker navy - secondary
          300: '#0f3460', // Card background
          400: '#0a1a2f', // Hover states
          500: '#050a14', // Active states
        }
      },
      fontFamily: {
        'display': ['Quicksand', 'sans-serif'],
        'body': ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'shine': 'shine 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'blink': 'blink 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shine: {
          'to': { left: '100%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 8px 24px rgba(255, 105, 180, 0.4)' },
          '50%': { boxShadow: '0 8px 32px rgba(255, 105, 180, 0.7)' },
        },
        blink: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '0.2' },
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'gradient-candy': 'linear-gradient(135deg, #FF69B4, #B19CD9)',
        'gradient-candy-pink': 'linear-gradient(135deg, #FF69B4, #FF1493)',
        'gradient-candy-blue': 'linear-gradient(135deg, #6EC5E9, #4A9FCC)',
        'gradient-candy-purple': 'linear-gradient(135deg, #B19CD9, #9370DB)',
        'gradient-candy-green': 'linear-gradient(135deg, #77DD77, #50C878)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      },
      boxShadow: {
        'candy': '0 8px 32px rgba(255, 105, 180, 0.2)',
        'candy-glow': '0 8px 24px rgba(255, 105, 180, 0.4)',
        'candy-glow-hover': '0 12px 32px rgba(255, 105, 180, 0.5)',
        'candy-blue': '0 8px 24px rgba(110, 197, 233, 0.3)',
        'candy-purple': '0 8px 24px rgba(177, 156, 217, 0.3)',
        'glass': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      borderRadius: {
        'candy': '1.5rem',
        'candy-lg': '2rem',
        'candy-sm': '1rem',
        'candy-xs': '0.75rem',
      },
      transitionTimingFunction: {
        'candy': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}