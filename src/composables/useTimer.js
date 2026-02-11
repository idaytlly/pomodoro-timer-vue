/**
 * Timer Composable - Core Pomodoro Timer Logic
 * Manages timer state, countdown, and session transitions
 */
import { ref, computed, onUnmounted } from 'vue';
import { addSession, getSetting, setSetting, updateDailyStats } from '../utils/db';
import { 
  playCompletionSound, 
  playNotificationSound,
  resumeAudioContext 
} from '../utils/audio';
import {
  notifyFocusComplete,
  notifyBreakComplete,
  notifyLongBreak
} from '../utils/notifications';

export function useTimer() {
  // Timer State
  const timerState = ref('idle'); // 'idle', 'running', 'paused'
  const currentMode = ref('focus'); // 'focus', 'shortBreak', 'longBreak'
  const timeRemaining = ref(25 * 60); // seconds
  const completedSessions = ref(0);
  
  // Settings with defaults
  const focusDuration = ref(25); // minutes
  const shortBreakDuration = ref(5);
  const longBreakDuration = ref(15);
  const autoStartBreaks = ref(false);
  const autoStartPomodoros = ref(false);
  const soundEnabled = ref(true);
  const notificationsEnabled = ref(true);
  
  let timerInterval = null;

  // Computed Properties
  const minutes = computed(() => Math.floor(timeRemaining.value / 60));
  const seconds = computed(() => timeRemaining.value % 60);
  
  const progress = computed(() => {
    const totalSeconds = getDurationInSeconds(currentMode.value);
    return ((totalSeconds - timeRemaining.value) / totalSeconds) * 100;
  });

  const circumference = 339.292; // 2 * PI * radius (54)
  const strokeDashoffset = computed(() => {
    return circumference - (progress.value / 100) * circumference;
  });

  const sessionDots = computed(() => {
    return Array.from({ length: 4 }, (_, i) => i < (completedSessions.value % 4));
  });

  // Helper Functions
  function getDurationInSeconds(mode) {
    switch (mode) {
      case 'focus':
        return focusDuration.value * 60;
      case 'shortBreak':
        return shortBreakDuration.value * 60;
      case 'longBreak':
        return longBreakDuration.value * 60;
      default:
        return focusDuration.value * 60;
    }
  }

  function getNextMode() {
    if (currentMode.value === 'focus') {
      const nextSession = completedSessions.value + 1;
      return nextSession % 4 === 0 ? 'longBreak' : 'shortBreak';
    }
    return 'focus';
  }

  // Timer Controls
  function startTimer() {
    if (timerState.value === 'running') return;
    
    timerState.value = 'running';
    resumeAudioContext(); // Resume audio context on user interaction
    
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--;
      } else {
        completeSession();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (timerState.value !== 'running') return;
    
    timerState.value = 'paused';
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimer() {
    pauseTimer();
    timerState.value = 'idle';
    timeRemaining.value = getDurationInSeconds(currentMode.value);
  }

  async function completeSession() {
    pauseTimer();
    
    const sessionType = currentMode.value;
    const duration = sessionType === 'focus' ? focusDuration.value : 
                     sessionType === 'shortBreak' ? shortBreakDuration.value : 
                     longBreakDuration.value;
    
    // Save session to database
    await addSession({
      type: sessionType,
      duration: duration
    });
    
    // Update statistics if focus session
    if (sessionType === 'focus') {
      completedSessions.value++;
      await updateDailyStats(null, duration);
    }
    
    // Play sound and show notification
    if (soundEnabled.value) {
      playCompletionSound();
    }
    
    if (notificationsEnabled.value) {
      if (sessionType === 'focus') {
        const nextSession = completedSessions.value;
        if (nextSession % 4 === 0) {
          notifyLongBreak();
        } else {
          notifyFocusComplete();
        }
      } else {
        notifyBreakComplete();
      }
    }
    
    // Auto-transition to next session
    const nextMode = getNextMode();
    const shouldAutoStart = (nextMode === 'focus' && autoStartPomodoros.value) ||
                           (nextMode !== 'focus' && autoStartBreaks.value);
    
    switchMode(nextMode, shouldAutoStart);
  }

  function switchMode(mode, autoStart = false) {
    currentMode.value = mode;
    timeRemaining.value = getDurationInSeconds(mode);
    timerState.value = 'idle';
    
    if (autoStart) {
      setTimeout(() => startTimer(), 1000);
    }
  }

  function skipSession() {
    const nextMode = getNextMode();
    switchMode(nextMode);
    
    if (soundEnabled.value) {
      playNotificationSound();
    }
  }

  // Settings Management
  async function loadSettings() {
    const settings = {
      focusDuration: await getSetting('focusDuration', 25),
      shortBreakDuration: await getSetting('shortBreakDuration', 5),
      longBreakDuration: await getSetting('longBreakDuration', 15),
      autoStartBreaks: await getSetting('autoStartBreaks', false),
      autoStartPomodoros: await getSetting('autoStartPomodoros', false),
      soundEnabled: await getSetting('soundEnabled', true),
      notificationsEnabled: await getSetting('notificationsEnabled', true),
      completedSessions: await getSetting('completedSessions', 0)
    };
    
    focusDuration.value = settings.focusDuration;
    shortBreakDuration.value = settings.shortBreakDuration;
    longBreakDuration.value = settings.longBreakDuration;
    autoStartBreaks.value = settings.autoStartBreaks;
    autoStartPomodoros.value = settings.autoStartPomodoros;
    soundEnabled.value = settings.soundEnabled;
    notificationsEnabled.value = settings.notificationsEnabled;
    completedSessions.value = settings.completedSessions;
    
    timeRemaining.value = getDurationInSeconds(currentMode.value);
  }

  async function updateSettings(newSettings) {
    if (newSettings.focusDuration !== undefined) {
      focusDuration.value = newSettings.focusDuration;
      await setSetting('focusDuration', newSettings.focusDuration);
    }
    if (newSettings.shortBreakDuration !== undefined) {
      shortBreakDuration.value = newSettings.shortBreakDuration;
      await setSetting('shortBreakDuration', newSettings.shortBreakDuration);
    }
    if (newSettings.longBreakDuration !== undefined) {
      longBreakDuration.value = newSettings.longBreakDuration;
      await setSetting('longBreakDuration', newSettings.longBreakDuration);
    }
    if (newSettings.autoStartBreaks !== undefined) {
      autoStartBreaks.value = newSettings.autoStartBreaks;
      await setSetting('autoStartBreaks', newSettings.autoStartBreaks);
    }
    if (newSettings.autoStartPomodoros !== undefined) {
      autoStartPomodoros.value = newSettings.autoStartPomodoros;
      await setSetting('autoStartPomodoros', newSettings.autoStartPomodoros);
    }
    if (newSettings.soundEnabled !== undefined) {
      soundEnabled.value = newSettings.soundEnabled;
      await setSetting('soundEnabled', newSettings.soundEnabled);
    }
    if (newSettings.notificationsEnabled !== undefined) {
      notificationsEnabled.value = newSettings.notificationsEnabled;
      await setSetting('notificationsEnabled', newSettings.notificationsEnabled);
    }
    
    // Reset timer if durations changed and timer is idle
    if (timerState.value === 'idle') {
      timeRemaining.value = getDurationInSeconds(currentMode.value);
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    // Save completed sessions count
    setSetting('completedSessions', completedSessions.value);
  });

  // Initialize settings
  loadSettings();

  return {
    // State
    timerState,
    currentMode,
    timeRemaining,
    completedSessions,
    minutes,
    seconds,
    progress,
    strokeDashoffset,
    circumference,
    sessionDots,
    
    // Settings
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    autoStartBreaks,
    autoStartPomodoros,
    soundEnabled,
    notificationsEnabled,
    
    // Methods
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    switchMode,
    loadSettings,
    updateSettings
  };
}