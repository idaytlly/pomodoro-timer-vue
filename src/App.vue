<template>
  <div class="app-container">
    <!-- Animated Background -->
    <div class="background-candy">
      <div class="candy-bubble bubble-1"></div>
      <div class="candy-bubble bubble-2"></div>
      <div class="candy-bubble bubble-3"></div>
      <div class="candy-bubble bubble-4"></div>
      <div class="candy-bubble bubble-5"></div>
    </div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <span class="title-emoji">🍭</span>
          Candy Pomodoro
        </h1>
        <div class="header-subtitle">Sweet productivity, one session at a time</div>
      </div>
      
      <!-- Tab Navigation -->
      <nav class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { 'active': activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <div class="content-container">
        
        <!-- Timer Tab -->
        <div v-show="activeTab === 'timer'" class="tab-content">
          <div class="timer-section">
            <TimerDisplay
              :minutes="minutes"
              :seconds="seconds"
              :currentMode="currentMode"
              :timerState="timerState"
              :strokeDashoffset="strokeDashoffset"
              :circumference="circumference"
              :sessionDots="sessionDots"
              @switchMode="switchMode"
            />
            
            <TimerControls
              :timerState="timerState"
              :currentMode="currentMode"
              @start="startTimer"
              @pause="pauseTimer"
              @reset="resetTimer"
              @skip="skipSession"
            />
          </div>
        </div>

        <!-- Tasks Tab -->
        <div v-show="activeTab === 'tasks'" class="tab-content">
          <TaskManager />
        </div>

        <!-- Statistics Tab -->
        <div v-show="activeTab === 'stats'" class="tab-content">
          <StatisticsPanel />
        </div>

        <!-- Settings Tab -->
        <div v-show="activeTab === 'settings'" class="tab-content">
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
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p class="footer-text">
        Made with 💖 by <a href="https://github.com/idayatullailiyeh" target="_blank" rel="noopener" class="footer-link">Ida Yatullailiyeh</a>
      </p>
      <p class="footer-subtext">Vue.js • Chart.js • IndexedDB</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTimer } from './composables/useTimer';
import TimerDisplay from './components/TimerDisplay.vue';
import TimerControls from './components/TimerControls.vue';
import TaskManager from './components/TaskManager.vue';
import StatisticsPanel from './components/StatisticsPanel.vue';
import SettingsPanel from './components/SettingsPanel.vue';

// Timer composable
const {
  timerState,
  currentMode,
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

// Tab navigation
const activeTab = ref('timer');
const tabs = [
  { id: 'timer', icon: '⏱️', label: 'Timer' },
  { id: 'tasks', icon: '✨', label: 'Tasks' },
  { id: 'stats', icon: '📊', label: 'Stats' },
  { id: 'settings', icon: '⚙️', label: 'Settings' }
];
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  width: 100%;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow-x: hidden;
}

/* Animated Candy Background */
.background-candy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.candy-bubble {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}

.bubble-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #FF69B4, transparent);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #6EC5E9, transparent);
  top: 60%;
  right: 10%;
  animation-delay: -5s;
}

.bubble-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #B19CD9, transparent);
  bottom: 20%;
  left: 5%;
  animation-delay: -10s;
}

.bubble-4 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #FFD700, transparent);
  top: 40%;
  right: 30%;
  animation-delay: -15s;
}

.bubble-5 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #77DD77, transparent);
  top: 70%;
  left: 40%;
  animation-delay: -7s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}

/* Header */
.app-header {
  position: relative;
  z-index: 10;
  padding: 2rem 1.5rem 1rem;
  text-align: center;
}

.header-content {
  margin-bottom: 2rem;
}

.app-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 4px 20px rgba(255, 105, 180, 0.5);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.title-emoji {
  font-size: 3rem;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.header-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
  font-weight: 400;
}

/* Tab Navigation */
.tab-nav {
  display: inline-flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 1.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.tab-btn.active {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(110, 197, 233, 0.3));
  color: white;
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Main Content */
.app-main {
  position: relative;
  z-index: 10;
  padding: 2rem 1.5rem 4rem;
  min-height: calc(100vh - 250px);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tab-content {
  animation: fadeIn 0.4s ease;
}

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

.timer-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

/* Footer */
.app-footer {
  position: relative;
  z-index: 10;
  padding: 2rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.5rem 0;
}

.footer-link {
  color: #FF69B4;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #FF1493;
  text-decoration: underline;
}

.footer-subtext {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 1rem 1rem;
  }

  .app-title {
    font-size: 2rem;
  }

  .title-emoji {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .tab-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .tab-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .tab-label {
    display: none;
  }

  .tab-icon {
    font-size: 1.3rem;
  }

  .app-main {
    padding: 1.5rem 1rem 3rem;
  }

  .timer-section {
    padding: 1.5rem;
  }

  .candy-bubble {
    filter: blur(40px);
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.75rem;
  }

  .timer-section {
    padding: 1rem;
  }

  .tab-btn {
    padding: 0.5rem 1rem;
  }
}
</style>