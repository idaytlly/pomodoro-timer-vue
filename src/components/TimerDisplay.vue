<template>
  <div class="w-full">
    <!-- Timer Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
      <div class="flex items-center gap-2 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full candy-gradient flex items-center justify-center flex-shrink-0">
          <ClockIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div class="min-w-0">
          <h2 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-candy-pink to-candy-blue bg-clip-text text-transparent truncate">
            Candy Pomodoro
          </h2>
          <p class="text-gray-400 text-xs sm:text-sm">Sweet productivity at your pace!</p>
        </div>
      </div>
      <div class="bg-white/10 px-3 sm:px-4 py-1 sm:py-2 rounded-full whitespace-nowrap">
        <span class="text-candy-yellow font-bold text-sm sm:text-base">{{ completedSessions }}</span>
        <span class="text-gray-400 ml-1 text-xs sm:text-sm">sessions</span>
      </div>
    </div>

    <!-- Timer Circle -->
    <div class="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto mb-6 sm:mb-8">
      <svg class="progress-ring w-full h-full drop-shadow-lg" viewBox="0 0 300 300">
        <circle
          class="progress-ring-circle"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          stroke-width="12"
          stroke="url(#gradient)"
          fill="transparent"
          r="138"
          cx="150"
          cy="150"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FF69B4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6EC5E9;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
      
      <div class="absolute inset-0 flex flex-col items-center justify-center px-2">
        <div class="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-candy-pink to-candy-blue bg-clip-text text-transparent">
          {{ currentTime }}
        </div>
        <div class="text-base sm:text-lg md:text-xl text-gray-300 mt-2">{{ timerTypeDisplay }}</div>
        <div class="text-xs sm:text-sm text-gray-400 mt-1">Session {{ currentSession }} of {{ sessionsBeforeLongBreak }}</div>
      </div>
    </div>

    <!-- Session Dots -->
    <div class="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto px-2">
      <div class="flex gap-2">
        <div v-for="i in sessionsBeforeLongBreak" 
             :key="i"
             class="w-3 h-3 rounded-full transition-all duration-300"
             :class="i <= currentSession ? 'bg-candy-pink scale-125' : 'bg-gray-600'">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentTime: String,
  timerType: String,
  currentSession: Number,
  completedSessions: Number,
  sessionsBeforeLongBreak: Number,
  progress: Number,
  strokeDashoffset: Number,
  circumference: Number
})

const timerTypeDisplay = computed(() => {
  switch (props.timerType) {
    case 'focus': return 'Focus Time 🎯'
    case 'shortBreak': return 'Short Break 🍬'
    case 'longBreak': return 'Long Break 🎉'
    default: return 'Focus Time'
  }
})
</script>

<style scoped>
.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.5s;
  transform-origin: 50% 50%;
}
</style>