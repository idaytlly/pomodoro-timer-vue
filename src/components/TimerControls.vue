<template>
  <div class="candy-card w-full">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      <button
        @click="startTimer"
        :disabled="isRunning"
        class="candy-btn bg-gradient-to-r from-candy-green to-emerald-500 hover:from-emerald-500 hover:to-candy-green disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center text-xs sm:text-sm py-2 sm:py-3"
      >
        <PlayIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="hidden sm:inline">Start</span>
      </button>

      <button
        @click="pauseTimer"
        :disabled="!isRunning || isPaused"
        class="candy-btn bg-gradient-to-r from-candy-yellow to-amber-500 hover:from-amber-500 hover:to-candy-yellow disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center text-xs sm:text-sm py-2 sm:py-3"
      >
        <PauseIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="hidden sm:inline">Pause</span>
      </button>

      <button
        @click="resetTimer"
        class="candy-btn bg-gradient-to-r from-candy-blue to-cyan-500 hover:from-cyan-500 hover:to-candy-blue w-full justify-center text-xs sm:text-sm py-2 sm:py-3"
      >
        <ArrowPathIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="hidden sm:inline">Reset</span>
      </button>

      <button
        @click="skipTimer"
        class="candy-btn bg-gradient-to-r from-candy-purple to-violet-500 hover:from-violet-500 hover:to-candy-purple w-full justify-center text-xs sm:text-sm py-2 sm:py-3"
      >
        <ForwardIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="hidden sm:inline">Skip</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon, 
  ForwardIcon 
} from '@heroicons/vue/24/outline'

defineProps({
  isRunning: Boolean,
  isPaused: Boolean
})

const emit = defineEmits(['start', 'pause', 'reset', 'skip'])

const startTimer = () => emit('start')
const pauseTimer = () => emit('pause')
const resetTimer = () => emit('reset')
const skipTimer = () => emit('skip')
</script>