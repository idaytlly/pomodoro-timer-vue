import { ref, computed, onUnmounted, watch } from 'vue'
import { db } from '../utils/db'
import { playSound, notify } from '../utils/notifications'

export default function useTimer(settings) {
  // Timer state
  const isRunning = ref(false)
  const isPaused = ref(false)
  const currentTime = ref(25 * 60) // 25 minutes in seconds
  const timerType = ref('focus') // 'focus' | 'shortBreak' | 'longBreak'
  const currentSession = ref(1)
  const completedSessions = ref(0)
  
  let timerInterval = null
  
  // Computed properties
  const displayTime = computed(() => {
    const minutes = Math.floor(currentTime.value / 60)
    const seconds = currentTime.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  const progress = computed(() => {
    const totalTime = timerType.value === 'focus' ? settings.focusTime * 60 :
                     timerType.value === 'shortBreak' ? settings.shortBreak * 60 :
                     settings.longBreak * 60
    return 1 - (currentTime.value / totalTime)
  })
  
  const circumference = 2 * Math.PI * 138
  const strokeDashoffset = computed(() => circumference - (progress.value * circumference))
  
  // Timer methods
  const startTimer = () => {
    if (!isRunning.value) {
      isRunning.value = true
      isPaused.value = false
      
      timerInterval = setInterval(() => {
        if (currentTime.value > 0) {
          currentTime.value--
        } else {
          completeTimer()
        }
      }, 1000)
    }
  }
  
  const pauseTimer = () => {
    if (isRunning.value) {
      isRunning.value = false
      isPaused.value = true
      clearInterval(timerInterval)
    }
  }
  
  const resetTimer = () => {
    isRunning.value = false
    isPaused.value = false
    clearInterval(timerInterval)
    resetToCurrentType()
  }
  
  const skipTimer = () => {
    completeTimer()
  }
  
  const completeTimer = async () => {
    clearInterval(timerInterval)
    isRunning.value = false
    isPaused.value = false
    
    // Save session to IndexedDB
    await db.addSession({
      type: timerType.value,
      duration: timerType.value === 'focus' ? settings.focusTime : 
               timerType.value === 'shortBreak' ? settings.shortBreak : 
               settings.longBreak,
      completedAt: new Date().toISOString()
    })
    
    // Update session count for focus sessions
    if (timerType.value === 'focus') {
      completedSessions.value++
    }
    
    // Play sound and notify
    if (settings.soundEnabled) {
      playSound('complete')
    }
    
    if (settings.desktopNotifications) {
      notify(
        timerType.value === 'focus' ? 'Focus session complete!' : 'Break time over!',
        timerType.value === 'focus' ? 'Time for a break!' : 'Ready to focus again?'
      )
    }
    
    // Switch to next timer
    switchToNextTimer()
  }
  
  const switchToNextTimer = () => {
    if (timerType.value === 'focus') {
      currentSession.value++
      
      if (currentSession.value > settings.sessionsBeforeLongBreak) {
        timerType.value = 'longBreak'
        currentSession.value = 1
      } else {
        timerType.value = 'shortBreak'
      }
    } else {
      timerType.value = 'focus'
    }
    
    resetToCurrentType()
    
    // Auto-start next timer if enabled
    const shouldAutoStart = (timerType.value === 'shortBreak' && settings.autoStartBreaks) ||
                           (timerType.value === 'longBreak' && settings.autoStartBreaks) ||
                           (timerType.value === 'focus' && settings.autoStartPomodoros)
    
    if (shouldAutoStart) {
      setTimeout(() => startTimer(), 1000)
    }
  }
  
  const resetToCurrentType = () => {
    currentTime.value = timerType.value === 'focus' ? settings.focusTime * 60 :
                       timerType.value === 'shortBreak' ? settings.shortBreak * 60 :
                       settings.longBreak * 60
  }
  
  // Load timer state
  const loadTimerState = async () => {
    const savedState = await db.getSettings()
    if (savedState?.timerState) {
      const state = savedState.timerState
      timerType.value = state.timerType || 'focus'
      currentSession.value = state.currentSession || 1
      completedSessions.value = state.completedSessions || 0
      resetToCurrentType()
    }
  }
  
  // Save timer state
  const saveTimerState = async () => {
    const timerState = {
      timerType: timerType.value,
      currentSession: currentSession.value,
      completedSessions: completedSessions.value
    }
    
    const currentSettings = await db.getSettings() || {}
    await db.saveSettings({
      ...currentSettings,
      timerState
    })
  }
  
  // Watch for changes and auto-save
  watch([timerType, currentSession, completedSessions], async () => {
    try {
      await saveTimerState()
    } catch (err) {
      console.error('Error auto-saving timer state:', err)
    }
  }, { deep: true })
  
  // Cleanup
  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
    saveTimerState()
  })
  
  // Initialize
  resetToCurrentType()
  
  return {
    // State
    isRunning,
    isPaused,
    currentTime: displayTime,
    timerType,
    currentSession,
    completedSessions,
    progress,
    strokeDashoffset,
    circumference,
    
    // Methods
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    loadTimerState,
    saveTimerState
  }
}