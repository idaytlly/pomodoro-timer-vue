<template>
  <div class="timer-display">
    <!-- Mode Selector -->
    <div class="mode-selector">
      <button
        v-for="mode in modes"
        :key="mode.id"
        @click="$emit('switchMode', mode.id)"
        :class="[
          'mode-btn',
          { 'active': currentMode === mode.id }
        ]"
      >
        <span class="mode-icon">{{ mode.icon }}</span>
        <span class="mode-label">{{ mode.label }}</span>
      </button>
    </div>

    <!-- Candy Progress Ring -->
    <div class="progress-ring-container">
      <svg class="progress-ring" viewBox="0 0 120 120">
        <!-- Background circle -->
        <circle
          class="progress-ring-bg"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke-width="8"
        />
        
        <!-- Progress circle with candy gradient -->
        <circle
          class="progress-ring-circle"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke-width="8"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          :style="{ stroke: currentModeColor }"
        />
        
        <!-- Candy decorations -->
        <g class="candy-sparkles" v-if="timerState === 'running'">
          <circle cx="30" cy="20" r="2" :fill="currentModeColor" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="25" r="2" :fill="currentModeColor" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="90" r="2" :fill="currentModeColor" opacity="0.6">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="95" cy="85" r="2" :fill="currentModeColor" opacity="0.6">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      <!-- Timer Display -->
      <div class="timer-content">
        <div class="time-display">
          <span class="time-minutes">{{ formattedMinutes }}</span>
          <span class="time-separator">:</span>
          <span class="time-seconds">{{ formattedSeconds }}</span>
        </div>
        <div class="timer-label">{{ currentModeLabel }}</div>
      </div>
    </div>

    <!-- Session Counter Dots -->
    <div class="session-dots">
      <div
        v-for="(filled, index) in sessionDots"
        :key="index"
        :class="['session-dot', { 'filled': filled }]"
        :style="{ backgroundColor: filled ? currentModeColor : 'transparent' }"
      >
        <div class="dot-inner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  minutes: { type: Number, required: true },
  seconds: { type: Number, required: true },
  currentMode: { type: String, required: true },
  timerState: { type: String, required: true },
  strokeDashoffset: { type: Number, required: true },
  circumference: { type: Number, required: true },
  sessionDots: { type: Array, required: true }
});

defineEmits(['switchMode']);

const modes = [
  { id: 'focus', icon: '🎯', label: 'Focus' },
  { id: 'shortBreak', icon: '☕', label: 'Short Break' },
  { id: 'longBreak', icon: '🌟', label: 'Long Break' }
];

const formattedMinutes = computed(() => 
  String(props.minutes).padStart(2, '0')
);

const formattedSeconds = computed(() => 
  String(props.seconds).padStart(2, '0')
);

const currentModeLabel = computed(() => {
  return modes.find(m => m.id === props.currentMode)?.label || 'Focus';
});

const currentModeColor = computed(() => {
  switch (props.currentMode) {
    case 'focus':
      return '#FF69B4'; // candy pink
    case 'shortBreak':
      return '#6EC5E9'; // candy blue
    case 'longBreak':
      return '#B19CD9'; // candy purple
    default:
      return '#FF69B4';
  }
});
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

/* Mode Selector */
.mode-selector {
  display: flex;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 1.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.mode-btn.active {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(110, 197, 233, 0.3));
  color: white;
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
}

.mode-icon {
  font-size: 1.2rem;
}

.mode-label {
  font-size: 0.85rem;
}

/* Progress Ring */
.progress-ring-container {
  position: relative;
  width: 300px;
  height: 300px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  filter: drop-shadow(0 0 20px rgba(255, 105, 180, 0.3));
}

.progress-ring-bg {
  stroke: rgba(255, 255, 255, 0.1);
}

.progress-ring-circle {
  transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
  stroke-linecap: round;
}

.candy-sparkles {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Timer Content */
.timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time-display {
  font-family: 'Quicksand', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 4px 20px rgba(255, 105, 180, 0.5);
  letter-spacing: 0.05em;
  line-height: 1;
}

.time-separator {
  opacity: 0.7;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.2; }
}

.timer-label {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
}

/* Session Dots */
.session-dots {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.session-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.session-dot.filled {
  border-color: currentColor;
  box-shadow: 0 0 10px currentColor;
  animation: pulse 2s ease-in-out infinite;
}

.dot-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.session-dot.filled .dot-inner {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .progress-ring-container {
    width: 250px;
    height: 250px;
  }

  .time-display {
    font-size: 3rem;
  }

  .mode-label {
    display: none;
  }

  .mode-btn {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .progress-ring-container {
    width: 220px;
    height: 220px;
  }

  .time-display {
    font-size: 2.5rem;
  }

  .timer-label {
    font-size: 0.85rem;
  }
}
</style>