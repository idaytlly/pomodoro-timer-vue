<template>
  <div class="statistics-panel">
    <div class="stats-header">
      <h2 class="section-title">
        <span class="title-icon">📊</span>
        Statistics
      </h2>
      <button @click="refreshStats" class="refresh-btn" title="Refresh statistics">
        <span>🔄</span>
      </button>
    </div>

    <!-- Today's Summary Cards -->
    <div class="stats-cards">
      <div class="stat-card pink-card">
        <div class="card-icon">🎯</div>
        <div class="card-content">
          <div class="card-value">{{ todayFocusMinutes }}</div>
          <div class="card-label">Minutes Today</div>
        </div>
      </div>

      <div class="stat-card blue-card">
        <div class="card-icon">⚡</div>
        <div class="card-content">
          <div class="card-value">{{ todaySessionCount }}</div>
          <div class="card-label">Sessions Today</div>
        </div>
      </div>

      <div class="stat-card purple-card">
        <div class="card-icon">🌟</div>
        <div class="card-content">
          <div class="card-value">{{ productivityPercentage }}%</div>
          <div class="card-label">Productivity</div>
        </div>
      </div>
    </div>

    <!-- Weekly Progress Bar -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Weekly Goal</span>
        <span class="progress-value">{{ weeklyFocusMinutes }} / 2400 min</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: weeklyGoalProgress + '%' }">
          <div class="progress-shine"></div>
        </div>
      </div>
      <div class="progress-text">{{ weeklyGoalProgress }}% Complete</div>
    </div>

    <!-- Charts -->
    <div class="charts-container">
      <!-- Focus Minutes Chart -->
      <div class="chart-card">
        <h3 class="chart-title">📈 Weekly Focus Time</h3>
        <div class="chart-wrapper">
          <canvas ref="focusChartCanvas"></canvas>
        </div>
      </div>

      <!-- Sessions Chart -->
      <div class="chart-card">
        <h3 class="chart-title">📅 Daily Sessions</h3>
        <div class="chart-wrapper">
          <canvas ref="sessionsChartCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Sessions -->
    <div class="recent-sessions" v-if="recentSessions.length > 0">
      <h3 class="subsection-title">Recent Sessions</h3>
      <div class="sessions-list">
        <div
          v-for="session in recentSessions.slice(0, 5)"
          :key="session.id"
          class="session-item"
        >
          <div class="session-type">{{ formatSessionType(session.type) }}</div>
          <div class="session-info">
            <span class="session-duration">{{ session.duration }} min</span>
            <span class="session-time">{{ formatTimeAgo(session.completedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-state" v-if="isLoading">
      <div class="loading-spinner">📊</div>
      <p>Loading statistics...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useStatistics } from '../composables/useStatistics';

Chart.register(...registerables);

const {
  isLoading,
  todayFocusMinutes,
  todaySessionCount,
  weeklyFocusMinutes,
  productivityPercentage,
  weeklyGoalProgress,
  chartData,
  sessionChartData,
  recentSessions,
  refreshStats,
  formatSessionType,
  formatTimeAgo
} = useStatistics();

const focusChartCanvas = ref(null);
const sessionsChartCanvas = ref(null);
let focusChart = null;
let sessionsChart = null;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 105, 180, 0.5)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        family: 'Quicksand',
        size: 14,
        weight: 600
      },
      bodyFont: {
        family: 'Poppins',
        size: 13
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          family: 'Poppins',
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          family: 'Poppins',
          size: 11
        }
      }
    }
  }
};

function createCharts() {
  if (!focusChartCanvas.value || !sessionsChartCanvas.value) return;

  // Destroy existing charts
  if (focusChart) focusChart.destroy();
  if (sessionsChart) sessionsChart.destroy();

  // Create Focus Time Chart
  focusChart = new Chart(focusChartCanvas.value, {
    type: 'line',
    data: chartData.value,
    options: chartOptions
  });

  // Create Sessions Chart
  sessionsChart = new Chart(sessionsChartCanvas.value, {
    type: 'line',
    data: sessionChartData.value,
    options: chartOptions
  });
}

function updateCharts() {
  if (focusChart && chartData.value) {
    focusChart.data = chartData.value;
    focusChart.update();
  }

  if (sessionsChart && sessionChartData.value) {
    sessionsChart.data = sessionChartData.value;
    sessionsChart.update();
  }
}

// Watch for data changes
watch([chartData, sessionChartData], () => {
  if (focusChart && sessionsChart) {
    updateCharts();
  }
});

onMounted(() => {
  setTimeout(createCharts, 100); // Small delay to ensure canvas is ready
});

onUnmounted(() => {
  if (focusChart) focusChart.destroy();
  if (sessionsChart) sessionsChart.destroy();
});
</script>

<style scoped>
.statistics-panel {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.refresh-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: rotate(180deg);
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.pink-card {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 20, 147, 0.1));
}

.blue-card {
  background: linear-gradient(135deg, rgba(110, 197, 233, 0.2), rgba(110, 197, 233, 0.1));
}

.purple-card {
  background: linear-gradient(135deg, rgba(177, 156, 217, 0.2), rgba(177, 156, 217, 0.1));
}

.card-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.card-content {
  flex: 1;
}

.card-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.card-label {
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

/* Progress Section */
.progress-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.progress-value {
  font-family: 'Quicksand', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.progress-bar-container {
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF69B4, #B19CD9, #6EC5E9);
  border-radius: 0.75rem;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  to { left: 100%; }
}

.progress-text {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

/* Charts */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.chart-wrapper {
  height: 200px;
  position: relative;
}

/* Recent Sessions */
.recent-sessions {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.subsection-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.session-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.session-type {
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.session-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.session-duration {
  font-family: 'Quicksand', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.session-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.loading-spinner {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .card-value {
    font-size: 1.75rem;
  }

  .session-info {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-end;
  }
}
</style>