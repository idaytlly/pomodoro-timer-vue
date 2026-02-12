<template>
  <div class="app">
    <!-- Improved Header with gradient and better spacing -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="candy-title">
          <span class="title-icon animate-bounce-slow">🍭</span>
          <span class="title-text">Candy Pomodoro</span>
        </h1>
        <p class="header-tagline">Sweet productivity, one session at a time</p>
      </div>
      <nav class="header-nav">
        <button 
          @click="activeTab = 'timer'" 
          class="tab-btn" 
          :class="{ active: activeTab === 'timer' }"
        >
          <span class="tab-icon">⏱️</span>
          <span class="tab-label">Timer</span>
        </button>
        <button 
          @click="activeTab = 'stats'" 
          class="tab-btn" 
          :class="{ active: activeTab === 'stats' }"
        >
          <span class="tab-icon">📊</span>
          <span class="tab-label">Stats</span>
        </button>
        <button 
          @click="activeTab = 'settings'" 
          class="tab-btn" 
          :class="{ active: activeTab === 'settings' }"
        >
          <span class="tab-icon">⚙️</span>
          <span class="tab-label">Settings</span>
        </button>
      </nav>
    </header>

    <!-- Main Content with improved animations -->
    <main class="main-content">
      <!-- TIMER TAB - Side by Side Layout -->
      <Transition name="fade" mode="out-in">
        <div v-if="activeTab === 'timer'" class="tab-pane" key="timer">
          <div class="timer-layout">
            <!-- Left: Timer -->
            <div class="timer-column glass-card">
              <TimerDisplay
                :minutes="minutes"
                :seconds="seconds"
                :currentMode="timerMode"
                :timerState="timerState"
                :strokeDashoffset="strokeDashoffset"
                :circumference="circumference"
                :sessionDots="sessionDots"
                @switchMode="switchMode"
              />
              
              <TimerControls
                :timerState="timerState"
                :currentMode="timerMode"
                @start="startTimer"
                @pause="pauseTimer"
                @reset="resetTimer"
                @skip="skipSession"
              />
            </div>

            <!-- Right: Tasks -->
            <div class="tasks-column glass-card">
              <TaskManager />
            </div>
          </div>
        </div>

        <!-- STATS TAB -->
        <div v-else-if="activeTab === 'stats'" class="tab-pane" key="stats">
          <div class="full-width-content glass-card">
            <StatisticsPanel />
          </div>
        </div>

        <!-- SETTINGS TAB -->
        <div v-else-if="activeTab === 'settings'" class="tab-pane" key="settings">
          <div class="full-width-content glass-card">
            <SettingsPanel
              :focusDuration="focusDuration"
              :shortBreakDuration="shortBreakDuration"
              :longBreakDuration="longBreakDuration"
              :autoStartBreaks="autoStartBreaks"
              :autoStartPomodoros="autoStartPomodoros"
              :soundEnabled="soundEnabled"
              :notificationsEnabled="notificationsEnabled"
              @updateSettings="updateSettings"
            />
          </div>
        </div>
      </Transition>
    </main>

    <!-- Footer with version info -->
    <footer class="app-footer">
      <p>Made with 💖 and 🍬 | v1.4.0</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TimerDisplay from './components/TimerDisplay.vue';
import TimerControls from './components/TimerControls.vue';
import TaskManager from './components/TaskManager.vue';
import StatisticsPanel from './components/StatisticsPanel.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import { useTimer } from './composables/useTimer';

// Tabs
const activeTab = ref('timer');

// Timer
const {
  timerState,
  currentMode: timerMode,
  minutes,
  seconds,
  strokeDashoffset,
  circumference,
  sessionDots,
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  autoStartBreaks,
  autoStartPomodoros,
  soundEnabled,
  notificationsEnabled,
  startTimer,
  pauseTimer,
  resetTimer,
  skipSession,
  switchMode,
  updateSettings
} = useTimer();
</script>

<style>
/* ========== IMPROVED DARK CANDY THEME ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --candy-pink: #FF69B4;
  --candy-pink-dark: #FF1493;
  --candy-blue: #6EC5E9;
  --candy-purple: #B19CD9;
  --candy-green: #77DD77;
  --dark-bg: #1a1a2e;
  --dark-secondary: #16213e;
  --dark-card: #0f3460;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
}

.app {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ========== IMPROVED HEADER ========== */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.candy-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-text {
  background: linear-gradient(135deg, #FF69B4, #B19CD9, #6EC5E9);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title-icon {
  font-size: 2rem;
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.4));
}

.header-tagline {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  margin-left: 3rem;
}

.header-nav {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem;
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 1.25rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.tab-btn:hover::before {
  left: 100%;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: linear-gradient(135deg, #FF69B4, #B19CD9);
  color: white;
  box-shadow: 0 8px 24px rgba(255, 105, 180, 0.4);
}

.tab-icon {
  font-size: 1.25rem;
}

/* ========== MAIN CONTENT ========== */
.main-content {
  flex: 1;
  min-height: 0;
}

.tab-pane {
  height: 100%;
  animation: fadeIn 0.4s ease;
}

/* Glass Card Effect */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* ========== LAYOUTS ========== */
.timer-layout {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 2rem;
  height: 100%;
  min-height: 600px;
}

.timer-column,
.tasks-column {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.full-width-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

/* Custom Scrollbar */
.full-width-content::-webkit-scrollbar,
.tasks-column::-webkit-scrollbar {
  width: 8px;
}

.full-width-content::-webkit-scrollbar-track,
.tasks-column::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.full-width-content::-webkit-scrollbar-thumb,
.tasks-column::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FF69B4, #B19CD9);
  border-radius: 4px;
}

.full-width-content::-webkit-scrollbar-thumb:hover,
.tasks-column::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #FF1493, #9370DB);
}

/* ========== FOOTER ========== */
.app-footer {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* ========== ANIMATIONS ========== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 1400px) {
  .timer-layout {
    grid-template-columns: 480px 1fr;
  }
}

@media (max-width: 1200px) {
  .timer-layout {
    grid-template-columns: 450px 1fr;
  }
}

@media (max-width: 992px) {
  .app {
    padding: 1rem;
  }

  .timer-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    min-height: auto;
  }

  .full-width-content {
    max-height: 600px;
  }

  .app-header {
    flex-direction: column;
    text-align: center;
  }

  .header-tagline {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .app {
    gap: 1rem;
  }

  .candy-title {
    font-size: 2rem;
  }

  .tab-label {
    display: none;
  }

  .tab-btn {
    padding: 0.75rem 1rem;
  }

  .glass-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .candy-title {
    font-size: 1.75rem;
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .glass-card {
    padding: 1.25rem;
    border-radius: 1.5rem;
  }

  .app-header {
    padding: 1.25rem;
  }
}
</style>