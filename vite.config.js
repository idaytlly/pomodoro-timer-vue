import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/pomodoro-timer-vue/' : '/',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue': ['vue'],
          'chartjs': ['chart.js', 'vue-chartjs'],
          'idb': ['idb']
        }
      }
    }
  }
})