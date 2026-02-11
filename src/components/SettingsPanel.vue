<template>
  <div class="settings-panel">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-candy-blue flex items-center gap-2">
        ⚙️ Timer Settings
      </h2>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white transition">
        ✕
      </button>
    </div>
    
    <!-- Timer Duration Settings -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-300 mb-4">Timer Durations</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="setting-item">
          <label class="setting-label">Focus Time (min)</label>
          <input 
            v-model.number="localSettings.focusTime" 
            type="number" 
            min="1" 
            max="60"
            class="setting-input"
          />
          <div class="text-xs text-gray-400 mt-1">Default: 25 min</div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">Short Break (min)</label>
          <input 
            v-model.number="localSettings.shortBreak" 
            type="number" 
            min="1" 
            max="30"
            class="setting-input"
          />
          <div class="text-xs text-gray-400 mt-1">Default: 5 min</div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">Long Break (min)</label>
          <input 
            v-model.number="localSettings.longBreak" 
            type="number" 
            min="1" 
            max="60"
            class="setting-input"
          />
          <div class="text-xs text-gray-400 mt-1">Default: 15 min</div>
        </div>
      </div>
    </div>
    
    <!-- Advanced Settings -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-300 mb-4">Advanced Settings</h3>
      <div class="space-y-4">
        <div class="setting-item">
          <label class="setting-label">Sessions Before Long Break</label>
          <input 
            v-model.number="localSettings.sessionsBeforeLongBreak" 
            type="number" 
            min="1" 
            max="8"
            class="setting-input"
          />
          <div class="text-xs text-gray-400 mt-1">Default: 4 sessions</div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="localSettings.autoStartBreaks"
              id="autoStartBreaks"
              class="setting-checkbox"
            />
            <label for="autoStartBreaks" class="text-white cursor-pointer">
              Auto-start breaks after focus sessions
            </label>
          </div>
          
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="localSettings.autoStartPomodoros"
              id="autoStartPomodoros"
              class="setting-checkbox"
            />
            <label for="autoStartPomodoros" class="text-white cursor-pointer">
              Auto-start next pomodoro after breaks
            </label>
          </div>
          
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="localSettings.desktopNotifications"
              id="desktopNotifications"
              class="setting-checkbox"
            />
            <label for="desktopNotifications" class="text-white cursor-pointer">
              Enable desktop notifications
            </label>
          </div>
          
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="localSettings.soundEnabled"
              id="soundEnabled"
              class="setting-checkbox"
            />
            <label for="soundEnabled" class="text-white cursor-pointer">
              Enable sound alerts
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-4">
      <button @click="saveSettings" class="candy-btn bg-gradient-to-r from-candy-green to-emerald-500">
        💾 Save Settings
      </button>
      <button @click="resetToDefaults" class="candy-btn bg-gradient-to-r from-candy-blue to-cyan-500">
        🔄 Reset to Defaults
      </button>
      <button @click="clearAllData" class="candy-btn bg-gradient-to-r from-red-500 to-red-600">
        🗑️ Clear All Data
      </button>
    </div>
    
    <!-- Notification Permission -->
    <div v-if="!notificationPermissionGranted" class="mt-6 p-4 bg-candy-blue/10 rounded-xl">
      <p class="text-sm text-candy-blue mb-2">🔔 Enable desktop notifications for timer alerts</p>
      <button @click="requestNotificationPermission" class="px-4 py-2 bg-candy-blue text-white rounded-lg text-sm">
        Enable Notifications
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { playSound, notify } from '../utils/notifications'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'close'])

// Local copy of settings
const localSettings = reactive({ ...props.settings })

const notificationPermissionGranted = ref('Notification' in window && Notification.permission === 'granted')

const saveSettings = () => {
  emit('update', { ...localSettings })
  playSound('start')
  notify('Settings Saved', 'Your preferences have been updated!')
}

const resetToDefaults = () => {
  if (confirm('Reset all settings to defaults?')) {
    Object.assign(localSettings, {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: true,
      autoStartPomodoros: true,
      desktopNotifications: true,
      soundEnabled: true
    })
    notify('Settings Reset', 'All settings have been reset to defaults')
  }
}

const clearAllData = () => {
  if (confirm('⚠️ WARNING: This will delete all tasks and session history. This cannot be undone!')) {
    // Clear IndexedDB data
    localStorage.clear()
    sessionStorage.clear()
    notify('Data Cleared', 'All data has been deleted')
  }
}

const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    notificationPermissionGranted.value = permission === 'granted'
    
    if (notificationPermissionGranted.value) {
      notify('Notifications Enabled', 'You will now receive timer alerts!')
    }
  }
}

// Watch for changes in parent settings
watch(() => props.settings, (newSettings) => {
  Object.assign(localSettings, newSettings)
}, { deep: true })
</script>

<style scoped>
.settings-panel {
  background: #2d2d44;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-label {
  display: block;
  color: #D1D5DB;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.setting-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #9F7AEA;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  transition: border-color 0.3s ease;
}

.setting-input:focus {
  outline: none;
  border-color: #FF69B4;
}

.setting-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #FF69B4;
}

.candy-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.candy-btn:hover {
  transform: scale(1.05);
}

.candy-btn:active {
  transform: scale(0.95);
}
</style>