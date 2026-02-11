<template>
  <div class="timer-controls">
    <!-- Start/Pause Button -->
    <button
      @click="handleStartPause"
      class="control-btn primary-btn"
      :class="{ 'pulse': timerState === 'running' }"
    >
      <span class="btn-icon">{{ timerState === 'running' ? '⏸️' : '▶️' }}</span>
      <span class="btn-label">{{ timerState === 'running' ? 'Pause' : 'Start' }}</span>
    </button>

    <!-- Reset Button -->
    <button
      @click="$emit('reset')"
      class="control-btn secondary-btn"
      :disabled="timerState === 'idle'"
      title="Reset timer"
    >
      <span class="btn-icon">🔄</span>
      <span class="btn-label">Reset</span>
    </button>

    <!-- Skip Button -->
    <button
      @click="$emit('skip')"
      class="control-btn secondary-btn"
      title="Skip to next session"
    >
      <span class="btn-icon">⏭️</span>
      <span class="btn-label">Skip</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  timerState: { type: String, required: true },
  currentMode: { type: String, required: true }
});

const emit = defineEmits(['start', 'pause', 'reset', 'skip']);

function handleStartPause() {
  if (props.timerState === 'running') {
    emit('pause');
  } else {
    emit('start');
  }
}
</script>

<style scoped>
.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  flex-wrap: wrap;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 2rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.control-btn:hover::before {
  width: 300px;
  height: 300px;
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn:disabled:hover {
  transform: none;
}

/* Primary Button (Start/Pause) */
.primary-btn {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  color: white;
  box-shadow: 0 8px 24px rgba(255, 105, 180, 0.4);
  min-width: 180px;
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 105, 180, 0.5);
}

.primary-btn.pulse {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(255, 105, 180, 0.4);
  }
  50% {
    box-shadow: 0 8px 32px rgba(255, 105, 180, 0.7);
  }
}

/* Secondary Buttons */
.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Button Content */
.btn-icon {
  font-size: 1.3rem;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.btn-label {
  position: relative;
  z-index: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .timer-controls {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .control-btn {
    width: 100%;
    justify-content: center;
  }

  .primary-btn {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .control-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .btn-icon {
    font-size: 1.2rem;
  }

  .btn-label {
    font-size: 0.9rem;
  }
}
</style>