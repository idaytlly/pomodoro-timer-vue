import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'
import { initDB } from './utils/db'

// Initialize IndexedDB before mounting the app
initDB().then(() => {
  createApp(App).mount('#app')
}).catch(error => {
  console.error('Failed to initialize database:', error)
  // Mount app anyway
  createApp(App).mount('#app')
})