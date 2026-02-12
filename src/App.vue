<template>
  <div class="dashboard">
    <!-- TOP SECTION: mode chips + timer controls + session counter -->
    <div class="top-section">
      <div class="mode-chips">
        <div 
          v-for="mode in modes" 
          :key="mode.id"
          class="chip" 
          :class="{ active: timerMode === mode.id }" 
          @click="switchMode(mode.id)"
        >
          <span class="icon">{{ mode.icon }}</span> {{ mode.label }}
        </div>
      </div>

      <!-- compact timer ring + digits -->
      <div class="compact-timer-ring">
        <div class="ring-container">
          <svg width="110" height="110" viewBox="0 0 120 120">
            <circle 
              class="ring-bg" 
              cx="60" cy="60" r="50" 
              stroke="rgba(255,190,210,0.4)" 
              stroke-width="8" 
              fill="none" 
            />
            <circle 
              class="ring-progress" 
              cx="60" cy="60" r="50" 
              :stroke="currentModeColor"
              stroke-width="8" 
              fill="none"
              :stroke-dasharray="circumference" 
              :stroke-dashoffset="strokeDashoffset"
              style="transform: rotate(-90deg); transform-origin: 60px 60px;" 
            />
          </svg>
          <div class="timer-digits">
            {{ formattedMinutes }}:{{ formattedSeconds }}
          </div>
          <div class="timer-label">{{ currentModeLabel }}</div>
        </div>
      </div>

      <!-- start/pause/reset buttons -->
      <div class="button-group">
        <button 
          v-if="timerState !== 'running'" 
          @click="startTimer" 
          class="btn-timer"
        >
          <span style="font-size:1.2rem;">▶️</span> Start
        </button>
        <button 
          v-else 
          @click="pauseTimer" 
          class="btn-timer" 
          style="background: #b4a0d4;"
        >
          <span style="font-size:1.2rem;">⏸️</span> Pause
        </button>
        <button @click="resetTimer" class="btn-secondary">
          ↺ Reset
        </button>
      </div>
    </div>

    <!-- MAIN 2-COLUMN GRID (NO SCROLL) -->
    <div class="main-grid">
      <!-- LEFT COLUMN: Tasks + quick add -->
      <div class="left-col">
        <div class="glass-panel tasks-panel">
          <div class="task-mini-header">
            <h3 class="panel-title">
              <span>🍬</span> Tasks 
              <span class="task-badge">{{ activeTasks.length }}</span>
            </h3>
            <span class="completion-badge">{{ completionRate }}% done</span>
          </div>

          <div class="task-input-row">
            <input 
              v-model="newTaskTitle" 
              @keyup.enter="addTask" 
              class="task-mini-input" 
              placeholder="Write a task..."
              maxlength="50"
            >
            <button @click="addTask" class="btn-add">+</button>
          </div>

          <div class="scrollable-y task-list-container">
            <div class="task-list-mini">
              <div 
                v-for="task in sortedTasks" 
                :key="task.id" 
                class="task-item-mini"
              >
                <div 
                  @click="toggleTask(task.id)" 
                  class="task-check" 
                  :class="{ done: task.completed }"
                >
                  <span v-if="task.completed">✓</span>
                </div>
                <span 
                  class="task-title" 
                  :class="{ completed: task.completed }"
                >{{ task.title }}</span>
                <button 
                  @click="deleteTask(task.id)" 
                  class="task-delete-btn"
                >🗑️</button>
              </div>

              <!-- ✅ FIXED HERE -->
              <div 
                v-if="tasks.length === 0" 
                class="empty-tasks"
              >
                ✨ No tasks — add one!
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: STATS + SETTINGS (MINI) -->
      <div class="right-col">
        <!-- STATS PANEL (COMPACT) -->
        <div class="glass-panel stats-panel">
          <div class="panel-header">
            <span class="panel-icon">📊</span>
            <h3 class="panel-title">Today</h3>
          </div>
          
          <div class="stats-micro-grid">
            <div class="stat-bubble">
              <div class="stat-number">{{ todayMinutes }}</div>
              <div class="stat-label">minutes</div>
            </div>
            <div class="stat-bubble">
              <div class="stat-number">{{ todaySessions }}</div>
              <div class="stat-label">sessions</div>
            </div>
          </div>
          
          <div class="weekly-progress-container">
            <div class="progress-header">
              <span>Weekly goal</span>
              <span>{{ weeklyTotal }} / {{ weeklyGoal }} min</span>
            </div>
            <div class="weekly-progress">
              <div 
                class="progress-fill" 
                :style="{ width: weeklyProgressPercent + '%' }"
              ></div>
            </div>
          </div>
          
          <div class="streak-info">
            <span>🔥 {{ streak }} day streak</span>
            <span>🎯 {{ completedSessions }}/{{ totalSessions }} sessions</span>
          </div>
        </div>

        <!-- SETTINGS MINI -->
        <div class="glass-panel settings-panel">
          <div class="panel-header">
            <span class="panel-icon">⚙️</span>
            <span class="panel-title">Quick settings</span>
          </div>
          
          <div class="settings-mini-row">
            <div class="toggle-mini">
              <span>🔔 Sound</span>
              <div 
                @click="toggleSetting('soundEnabled')" 
                class="toggle-switch" 
                :class="{ active: settings.soundEnabled }"
              >
                <div class="toggle-slider"></div>
              </div>
            </div>
            <div class="toggle-mini">
              <span>🔕 Notif</span>
              <div 
                @click="toggleSetting('notificationsEnabled')" 
                class="toggle-switch" 
                :class="{ active: settings.notificationsEnabled }"
              >
                <div class="toggle-slider"></div>
              </div>
            </div>
            <div class="toggle-mini">
              <span>🔄 Auto break</span>
              <div 
                @click="toggleSetting('autoStartBreaks')" 
                class="toggle-switch" 
                :class="{ active: settings.autoStartBreaks }"
              >
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          
          <div class="duration-badges">
            <span>🍬 Focus: {{ settings.focusDuration }}m</span>
            <span>☕ Break: {{ settings.shortBreakDuration }}m</span>
            <span>🌟 Long: {{ settings.longBreakDuration }}m</span>
          </div>
        </div>
        
        <!-- RECENT SESSIONS -->
        <div class="glass-panel recent-panel">
          <div class="recent-header">
            <span class="panel-icon">📋</span>
            <span class="panel-title">Recent</span>
            <span class="recent-badge">+{{ todaySessions }} today</span>
          </div>
          <div class="recent-sessions-list">
            <div 
              v-for="session in recentSessions" 
              :key="session.id" 
              class="recent-session-item"
            >
              <span>{{ session.type === 'focus' ? '🎯' : session.type === 'shortBreak' ? '☕' : '🌟' }}</span>
              <span>{{ session.duration }}m</span>
            </div>
            <span v-if="recentSessions.length === 0" class="no-sessions">No sessions yet</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useTasks } from './composables/useTasks';
import { useStatistics } from './composables/useStatistics';
import { useTimer } from './composables/useTimer';
import { playCompletionSound, setSoundEnabled } from './utils/audio';
import { setNotificationsEnabled, requestNotificationPermission } from './utils/notifications';

// ============ STORE COMPOSABLES ============
const { 
  tasks, 
  newTaskTitle, 
  addTask, 
  toggleTask, 
  deleteTask,
  activeTasks,
  completedTasks,
  completionRate 
} = useTasks();

const {
  todayFocusMinutes: todayMinutes,
  todaySessionCount: todaySessions,
  weeklyFocusMinutes: weeklyTotal,
  weeklyGoalProgress,
  recentSessions,
  formatSessionType,
  refreshStats
} = useStatistics();

// ============ TIMER ============
const {
  mode: timerMode,
  timerState,
  minutes,
  seconds,
  progress,
  start,
  pause,
  reset,
  switchMode,
  circumference,
  strokeDashoffset,
  formattedMinutes,
  formattedSeconds,
  currentModeLabel,
  currentModeColor
} = useTimer();

// ============ SETTINGS ============
const settings = reactive({
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: false
});

// ============ MODES ============
const modes = [
  { id: 'focus', icon: '🎯', label: 'Focus' },
  { id: 'shortBreak', icon: '☕', label: 'Short' },
  { id: 'longBreak', icon: '🌟', label: 'Long' }
];

// ============ STATS COMPUTED ============
const weeklyGoal = 1200; // 20 hours in minutes
const weeklyProgressPercent = computed(() => {
  return Math.min(100, Math.round((weeklyTotal.value / weeklyGoal) * 100));
});

const streak = ref(4);
const completedSessions = ref(12);
const totalSessions = ref(20);

// ============ TASKS SORTING ============
const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    // Active tasks first, then completed
    if (a.completed === b.completed) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.completed ? 1 : -1;
  });
});

// ============ TIMER METHODS ============
function startTimer() {
  start();
}

function pauseTimer() {
  pause();
}

function resetTimer() {
  reset();
}

// ============ SETTINGS METHODS ============
function toggleSetting(key) {
  settings[key] = !settings[key];
  
  if (key === 'soundEnabled') {
    setSoundEnabled(settings.soundEnabled);
    if (settings.soundEnabled) {
      playCompletionSound(); // test sound
    }
  }
  
  if (key === 'notificationsEnabled') {
    if (settings.notificationsEnabled) {
      requestNotificationPermission().then(granted => {
        settings.notificationsEnabled = granted;
        setNotificationsEnabled(granted);
      });
    } else {
      setNotificationsEnabled(false);
    }
  }
  
  // Save to localStorage
  localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
}

// ============ LOAD SAVED SETTINGS ============
onMounted(() => {
  const savedSettings = localStorage.getItem('pomodoro-settings');
  if (savedSettings) {
    Object.assign(settings, JSON.parse(savedSettings));
    setSoundEnabled(settings.soundEnabled);
    setNotificationsEnabled(settings.notificationsEnabled);
  }
  
  refreshStats();
});
</script>

<style scoped>
/* ---------- NO-SCROLL DASHBOARD LAYOUT ---------- */
.dashboard {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px;
  gap: 12px;
  overflow: hidden;
  background: linear-gradient(145deg, #faf3f0 0%, #ffe9f0 100%);
}

/* Top Section */
.top-section {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 8px 16px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 12px;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

/* Glass Panels */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 20px rgba(255, 140, 200, 0.1);
}

.tasks-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.stats-panel, .settings-panel, .recent-panel {
  flex-shrink: 0;
}

/* Scrollable Area */
.scrollable-y {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #ffb3c6 rgba(255, 255, 255, 0.3);
  flex: 1;
  min-height: 0;
  margin-top: 8px;
}

.scrollable-y::-webkit-scrollbar {
  width: 4px;
}

.scrollable-y::-webkit-scrollbar-track {
  background: rgba(255, 200, 220, 0.2);
  border-radius: 8px;
}

.scrollable-y::-webkit-scrollbar-thumb {
  background: #ffb3c6;
  border-radius: 8px;
}

/* ---------- MODE CHIPS ---------- */
.mode-chips {
  display: flex;
  gap: 6px;
}

.chip {
  padding: 6px 14px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  font-weight: 600;
  color: #5e4b6e;
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip.active {
  background: #ff85b3;
  color: white;
  border-color: #ff85b3;
  box-shadow: 0 4px 12px rgba(255, 133, 179, 0.4);
}

.chip .icon {
  margin-right: 4px;
}

/* ---------- TIMER RING ---------- */
.compact-timer-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.ring-container {
  position: relative;
  width: 110px;
  height: 110px;
}

.ring-bg {
  stroke: rgba(255, 190, 210, 0.4);
}

.ring-progress {
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s linear;
}

.timer-digits {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Quicksand', sans-serif;
  font-size: 2.1rem;
  font-weight: 700;
  color: #4a3f5e;
  line-height: 1;
}

.timer-label {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: #6b5b7e;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ---------- BUTTONS ---------- */
.button-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-timer {
  background: #ff85b3;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 0 #d46b91;
  transition: all 0.08s linear;
  cursor: pointer;
}

.btn-timer:active {
  transform: translateY(6px);
  box-shadow: 0 1px 0 #d46b91;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ffe2eb;
  color: #5e4b6e;
  padding: 10px 18px;
  border-radius: 40px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: white;
  border-color: #ff85b3;
}

/* ---------- TASK MANAGER ---------- */
.task-mini-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-title {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5e4b6e;
  margin: 0;
}

.task-badge {
  background: #ffb3c6;
  padding: 2px 8px;
  border-radius: 40px;
  font-size: 0.8rem;
  color: #4a3f5e;
}

.completion-badge {
  background: #e1f0e8;
  padding: 4px 10px;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #2d6a4f;
}

.task-input-row {
  display: flex;
  gap: 8px;
}

.task-mini-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 200, 220, 0.8);
  border-radius: 40px;
  padding: 10px 16px;
  font-size: 0.85rem;
  color: #2d2d4a;
  transition: all 0.2s ease;
}

.task-mini-input:focus {
  outline: none;
  border-color: #ff69b4;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.btn-add {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: linear-gradient(145deg, #ff85b3, #ff9ec0);
  border: none;
  color: white;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 133, 179, 0.4);
  transition: all 0.2s ease;
}

.btn-add:hover {
  transform: scale(1.05);
}

.task-list-container {
  margin-top: 8px;
  padding-right: 4px;
}

.task-list-mini {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-item-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.task-item-mini:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

.task-check {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 2px solid #ffb6c1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-check.done {
  background: #77dd77;
  border-color: #77dd77;
  color: white;
}

.task-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-title.completed {
  text-decoration: line-through;
  color: #888;
}

.task-delete-btn {
  background: none;
  border: none;
  color: #ff9494;
  cursor: pointer;
  padding: 4px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.task-delete-btn:hover {
  background: rgba(255, 148, 148, 0.1);
  transform: scale(1.1);
}

.empty-tasks {
  padding: 20px;
  text-align: center;
  color: #aaa;
  font-size: 0.9rem;
}

/* ---------- STATS PANEL ---------- */
.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.panel-icon {
  font-size: 1.4rem;
}

.stats-micro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-bubble {
  background: white;
  border-radius: 20px;
  padding: 12px 8px;
  text-align: center;
  border: 1px solid rgba(255, 210, 220, 0.6);
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ff69b4;
  line-height: 1;
  font-family: 'Quicksand', sans-serif;
}

.stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b5b7e;
}

.weekly-progress-container {
  margin-top: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #6b5b7e;
  margin-bottom: 4px;
}

.weekly-progress {
  background: rgba(255, 240, 245, 0.7);
  border-radius: 40px;
  height: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 10px;
  border-radius: 40px;
  background: linear-gradient(90deg, #ffb3c6, #ff9eb5);
  width: 0%;
  transition: width 0.3s ease;
}

.streak-info {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  font-size: 0.7rem;
  color: #9370db;
}

/* ---------- SETTINGS PANEL ---------- */
.settings-mini-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top:  8px;
  align-items: center;
}

.toggle-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
}

.toggle-switch {
  width: 40px;
  height: 22px;
  background: rgba(200, 200, 220, 0.5);
  border-radius: 40px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-switch.active {
  background: #ff85b3;
}

.toggle-slider {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 18px;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.toggle-switch.active .toggle-slider {
  left: 20px;
}

.duration-badges {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  font-size: 0.7rem;
  color: #7a6a8a;
  padding-top: 8px;
  border-top: 1px solid rgba(0,0,0,0.05);
}

/* ---------- RECENT SESSIONS PANEL ---------- */
.recent-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.recent-badge {
  background: #ffe4ed;
  padding: 2px 8px;
  border-radius: 40px;
  font-size: 0.6rem;
  font-weight: 600;
  color: #6b5b7e;
  margin-left: auto;
}

.recent-sessions-list {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 0.75rem;
  flex-wrap: wrap;
}

.recent-session-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.5);
  padding: 4px 10px;
  border-radius: 40px;
}

.no-sessions {
  color: #aaa;
  font-size: 0.75rem;
  padding: 4px 0;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 800px) {
  .main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  
  .top-section {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 8px;
  }
  
  .mode-chips {
    justify-content: center;
  }
  
  .button-group {
    justify-content: center;
  }
  
  .timer-digits {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 8px;
  }
  
  .glass-panel {
    padding: 12px;
  }
  
  .stat-number {
    font-size: 1.4rem;
  }
  
  .settings-mini-row {
    gap: 12px;
  }
}
</style>
