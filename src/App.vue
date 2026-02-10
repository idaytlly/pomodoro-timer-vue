<template>
  <div class="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900">
    <!-- Header -->
    <header class="candy-gradient py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 shadow-2xl sticky top-0 z-50">
      <div class="container mx-auto">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div class="flex items-center gap-2 sm:gap-4 min-w-0">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <span class="text-xl sm:text-2xl">🍭</span>
            </div>
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl md:text-4xl font-bold text-white truncate">
                Candy Pomodoro
              </h1>
              <p class="text-white/80 mt-0.5 sm:mt-1 text-xs sm:text-sm">Vue.js 3 + IndexedDB</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="hidden sm:block text-right">
              <div class="text-white font-bold text-sm">Total Focus Time</div>
              <div class="text-candy-yellow text-lg sm:text-2xl font-bold">{{ totalFocusTime }}m</div>
            </div>
            <button
              @click="toggleSettings"
              class="p-2 sm:p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
            >
              <span class="text-xl sm:text-2xl">⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-max lg:auto-rows-min">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <TimerDisplay
            :current-time="currentTime"
            :timer-type="timerType"
            :current-session="currentSession"
            :completed-sessions="completedSessions"
            :sessions-before-long-break="settings.sessionsBeforeLongBreak"
            :progress="progress"
            :stroke-dashoffset="strokeDashoffset"
            :circumference="circumference"
          />
          
          <TimerControls
            :is-running="isRunning"
            :is-paused="isPaused"
            @start="startTimer"
            @pause="pauseTimer"
            @reset="resetTimer"
            @skip="skipTimer"
          />
          
          <TaskManager />
        </div>

        <!-- Right Column -->
        <div class="space-y-4 sm:space-y-6 lg:space-y-8">
          <!-- Statistics Panel -->
          <div class="candy-card min-h-72 sm:min-h-80 lg:min-h-96 w-full flex flex-col items-center justify-center">
            <StatisticsPanel />
          </div>
          
          <!-- Settings Panel -->
          <div v-if="showSettings" class="candy-card w-full">
            <SettingsPanel 
              :settings="settings"
              @update="updateSettings"
              @close="showSettings = false"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-8 sm:mt-12 py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 border-t border-white/10">
      <div class="container mx-auto text-center text-gray-400 text-xs sm:text-sm">
        <p>Built with Vue.js 3, Chart.js, and IndexedDB • Candy Pomodoro Timer v1.0</p>
        <p class="mt-1 sm:mt-2 text-xs text-gray-500">Works offline • Data stored locally • No tracking</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import TimerDisplay from './components/TimerDisplay.vue'
import TimerControls from './components/TimerControls.vue'
import TaskManager from './components/TaskManager.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import useTimer from './composables/useTimer'
import { db } from './utils/db'

// Settings
const settings = reactive({
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  desktopNotifications: true,
  soundEnabled: true
})

const showSettings = ref(false)
const totalFocusTime = ref(0)

// Use timer composable
const timer = useTimer(settings)
const {
  isRunning,
  isPaused,
  currentTime,
  timerType,
  currentSession,
  completedSessions,
  progress,
  strokeDashoffset,
  circumference,
  startTimer,
  pauseTimer,
  resetTimer,
  skipTimer,
  loadTimerState
} = timer

// Real-time update interval
let focusTimeInterval = null

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().catch(err => console.log('Notification permission error:', err))
}

// Load settings from IndexedDB
const loadSettings = async () => {
  try {
    const savedSettings = await db.getSettings()
    if (savedSettings) {
      Object.assign(settings, savedSettings)
    }
  } catch (err) {
    console.log('Error loading settings:', err)
  }
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const updateSettings = async (newSettings) => {
  try {
    Object.assign(settings, newSettings)
    await db.saveSettings(settings)
  } catch (err) {
    console.error('Error updating settings:', err)
  }
}

// Calculate total focus time
const calculateTotalFocusTime = async () => {
  try {
    const sessions = await db.getWeeklyStats()
    totalFocusTime.value = sessions
      .filter(s => s.type === 'focus')
      .reduce((sum, s) => sum + (s.duration || 0), 0)
  } catch (err) {
    console.log('Error calculating focus time:', err)
  }
}

onMounted(async () => {
  try {
    await loadSettings()
    await loadTimerState()
    await calculateTotalFocusTime()
    console.log('App mounted successfully!')
    
    // Update total focus time every 5 seconds for real-time display
    focusTimeInterval = setInterval(() => {
      calculateTotalFocusTime()
    }, 5000)
  } catch (err) {
    console.error('Error during app initialization:', err)
  }
})

onUnmounted(() => {
  if (focusTimeInterval) {
    clearInterval(focusTimeInterval)
  }
})
</script>