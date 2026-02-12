import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.css';

// Initialize IndexedDB on app start
import { initDB } from './utils/db';
initDB();

// Request notification permissions
import { requestNotificationPermission } from './utils/notifications';
requestNotificationPermission();

createApp(App).mount('#app');