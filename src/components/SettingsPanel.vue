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
  @apply bg-dark-card rounded-2xl p-6 shadow-2xl border border-white/10;
}

.setting-item {
  @apply mb-4;
}

.setting-label {
  @apply block text-gray-300 mb-2 font-medium;
}

.setting-input {
  @apply w-full bg-white/10 border-2 border-candy-purple rounded-xl px-4 py-3 text-white focus:outline-none focus:border-candy-pink transition;
}

.setting-checkbox {
  @apply w-5 h-5 accent-candy-pink cursor-pointer;
}

.candy-btn {
  @apply flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95;
}
</style>