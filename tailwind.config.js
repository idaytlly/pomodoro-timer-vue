/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Candy Theme Colors
        candy: {
          pink: '#FF69B4',
          blue: '#6EC5E9',
          purple: '#B19CD9',
          green: '#77DD77',
          yellow: '#FFD700',
          orange: '#FFB347',
          dark: '#1a1a2e',
          darker: '#16213e',
          card: '#0f3460',
        }
      },
      fontFamily: {
        display: ['Quicksand', 'ui-sans-serif', 'system-ui'],
        body: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}