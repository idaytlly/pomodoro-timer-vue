<template>
  <div class="settings-panel">
    <div class="settings-header">
      <h2 class="section-title">
        <span class="title-icon">⚙️</span>
        Settings
      </h2>
    </div>

    <!-- Timer Durations -->
    <div class="settings-section">
      <h3 class="section-subtitle">⏱️ Timer Durations</h3>
      
      <div class="setting-group">
        <label class="setting-label">
          <span class="label-text">Focus Duration</span>
          <span class="label-value">{{ settings.focusDuration }} min</span>
        </label>
        <input
          v-model.number="settings.focusDuration"
          type="range"
          min="1"
          max="60"
          step="1"
          class="range-input pink-range"
          @change="saveSettings"
        />
      </div>

      <div class="setting-group">
        <label class="setting-label">
          <span class="label-text">Short Break</span>
          <span class="label-value">{{ settings.shortBreakDuration }} min</span>
        </label>
        <input
          v-model.number="settings.shortBreakDuration"
          type="range"
          min="1"
          max="30"
          step="1"
          class="range-input blue-range"
          @change="saveSettings"
        />
      </div>

      <div class="setting-group">
        <label class="setting-label">
          <span class="label-text">Long Break</span>
          <span class="label-value">{{ settings.longBreakDuration }} min</span>
        </label>
        <input
          v-model.number="settings.longBreakDuration"
          type="range"
          min="1"
          max="60"
          step="1"
          class="range-input purple-range"
          @change="saveSettings"
        />
      </div>
    </div>

    <!-- Auto-Start Options -->
    <div class="settings-section">
      <h3 class="section-subtitle">🚀 Auto-Start</h3>
      
      <div class="toggle-group">
        <label class="toggle-label">
          <div class="toggle-info">
            <span class="toggle-text">Auto-start Breaks</span>
            <span class="toggle-description">Automatically start break timers</span>
          </div>
          <button
            @click="toggleSetting('autoStartBreaks')"
            :class="['toggle-btn', { 'active': settings.autoStartBreaks }]"
          >
            <div class="toggle-slider"></div>
          </button>
        </label>
      </div>

      <div class="toggle-group">
        <label class="toggle-label">
          <div class="toggle-info">
            <span class="toggle-text">Auto-start Pomodoros</span>
            <span class="toggle-description">Automatically start focus sessions</span>
          </div>
          <button
            @click="toggleSetting('autoStartPomodoros')"
            :class="['toggle-btn', { 'active': settings.autoStartPomodoros }]"
          >
            <div class="toggle-slider"></div>
          </button>
        </label>
      </div>
    </div>

    <!-- Notifications & Sounds -->
    <div class="settings-section">
      <h3 class="section-subtitle">🔔 Notifications & Sounds</h3>
      
      <div class="toggle-group">
        <label class="toggle-label">
          <div class="toggle-info">
            <span class="toggle-text">Desktop Notifications</span>
            <span class="toggle-description">Show browser notifications</span>
          </div>
          <button
            @click="handleNotificationToggle"
            :class="['toggle-btn', { 'active': settings.notificationsEnabled }]"
          >
            <div class="toggle-slider"></div>
          </button>
        </label>
      </div>

      <div class="toggle-group">
        <label class="toggle-label">
          <div class="toggle-info">
            <span class="toggle-text">Sound Alerts</span>
            <span class="toggle-description">Play sounds on timer completion</span>
          </div>
          <button
            @click="toggleSetting('soundEnabled')"
            :class="['toggle-btn', { 'active': settings.soundEnabled }]"
          >
            <div class="toggle-slider"></div>
          </button>
        </label>
      </div>

      <button
        v-if="settings.soundEnabled"
        @click="playTestSound"
        class="test-sound-btn"
      >
        🔊 Test Sound
      </button>
    </div>

    <!-- Save Indicator -->
    <div class="save-indicator" v-if="showSaveIndicator">
      <span class="indicator-icon">✓</span>
      <span class="indicator-text">Settings saved!</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { playCompletionSound, setSoundEnabled } from '../utils/audio';
import { 
  requestNotificationPermission, 
  setNotificationsEnabled 
} from '../utils/notifications';

const props = defineProps({
  focusDuration: { type: Number, required: true },
  shortBreakDuration: { type: Number, required: true },
  longBreakDuration: { type: Number, required: true },
  autoStartBreaks: { type: Boolean, required: true },
  autoStartPomodoros: { type: Boolean, required: true },
  soundEnabled: { type: Boolean, required: true },
  notificationsEnabled: { type: Boolean, required: true }
});

const emit = defineEmits(['updateSettings']);

const settings = reactive({
  focusDuration: props.focusDuration,
  shortBreakDuration: props.shortBreakDuration,
  longBreakDuration: props.longBreakDuration,
  autoStartBreaks: props.autoStartBreaks,
  autoStartPomodoros: props.autoStartPomodoros,
  soundEnabled: props.soundEnabled,
  notificationsEnabled: props.notificationsEnabled
});

const showSaveIndicator = ref(false);

// Watch for prop changes
watch(() => props, (newProps) => {
  Object.assign(settings, newProps);
}, { deep: true });

function saveSettings() {
  emit('updateSettings', { ...settings });
  showSaveIndicator.value = true;
  setTimeout(() => {
    showSaveIndicator.value = false;
  }, 2000);
}

function toggleSetting(key) {
  settings[key] = !settings[key];
  
  // Update audio/notification utilities
  if (key === 'soundEnabled') {
    setSoundEnabled(settings.soundEnabled);
  }
  if (key === 'notificationsEnabled') {
    setNotificationsEnabled(settings.notificationsEnabled);
  }
  
  saveSettings();
}

async function handleNotificationToggle() {
  if (!settings.notificationsEnabled) {
    const granted = await requestNotificationPermission();
    if (granted) {
      settings.notificationsEnabled = true;
      setNotificationsEnabled(true);
      saveSettings();
    } else {
      alert('Please enable notifications in your browser settings to use this feature.');
    }
  } else {
    settings.notificationsEnabled = false;
    setNotificationsEnabled(false);
    saveSettings();
  }
}

function playTestSound() {
  playCompletionSound();
}
</script>

<style scoped>
.settings-panel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Header */
.settings-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: 'Quicksand', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.title-icon {
  font-size: 1.5rem;
}

/* Settings Sections */
.settings-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
}

.section-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Setting Group */
.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.label-text {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.label-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
}

/* Range Inputs */
.range-input {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.pink-range {
  background: linear-gradient(to right, #FF69B4, #FF1493);
}

.blue-range {
  background: linear-gradient(to right, #6EC5E9, #4A9FCC);
}

.purple-range {
  background: linear-gradient(to right, #B19CD9, #9370DB);
}

/* Toggle Groups */
.toggle-group {
  margin-bottom: 1rem;
}

.toggle-group:last-child {
  margin-bottom: 0;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-label:hover {
  background: rgba(255, 255, 255, 0.05);
}

.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toggle-text {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
}

.toggle-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Toggle Button */
.toggle-btn {
  position: relative;
  width: 52px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #FF69B4, #B19CD9);
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.toggle-btn.active .toggle-slider {
  transform: translateX(24px);
}

/* Test Sound Button */
.test-sound-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  margin-top: 1rem;
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(177, 156, 217, 0.2));
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 1rem;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-sound-btn:hover {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(177, 156, 217, 0.3));
  border-color: rgba(255, 105, 180, 0.5);
  transform: translateY(-2px);
}

/* Save Indicator */
.save-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(119, 221, 119, 0.2), rgba(80, 200, 120, 0.2));
  border: 1px solid rgba(119, 221, 119, 0.3);
  border-radius: 1rem;
  color: #77DD77;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  animation: slideIn 0.3s ease, fadeOut 0.3s ease 1.7s;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

.indicator-icon {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-section {
    padding: 1.25rem;
  }

  .toggle-label {
    padding: 0.875rem;
  }

  .toggle-info {
    max-width: calc(100% - 60px);
  }
}
</style>