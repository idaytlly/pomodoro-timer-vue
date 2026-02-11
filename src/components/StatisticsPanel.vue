<template>
  <div class="stats-panel">
    <h2 class="text-2xl font-bold text-candy-blue mb-6 flex items-center gap-2">
      📊 Statistics Dashboard
    </h2>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="stat-card">
        <div class="stat-value text-candy-pink">{{ stats.today.focusTime }}</div>
        <div class="stat-label">Focus Minutes</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value text-candy-blue">{{ stats.today.sessions }}</div>
        <div class="stat-label">Sessions</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value text-candy-green">{{ stats.today.tasksCompleted }}</div>
        <div class="stat-label">Tasks Done</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value text-candy-yellow">{{ stats.today.productivity }}%</div>
        <div class="stat-label">Productivity</div>
      </div>
    </div>
    
    <!-- Weekly Chart -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-300 mb-4">Weekly Focus Time</h3>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
    
    <!-- Recent Sessions -->
    <div>
      <h3 class="text-lg font-semibold text-gray-300 mb-4">Recent Sessions</h3>
      <div class="space-y-3">
        <div v-for="(session, index) in recentSessions" :key="index" class="session-item">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="session-type" :class="session.type"></div>
              <span class="text-white">{{ formatSessionType(session.type) }}</span>
            </div>
            <div class="text-candy-yellow">{{ session.duration }}min</div>
          </div>
          <div class="text-gray-400 text-sm mt-1">
            {{ formatTime(session.completedAt) }}
          </div>
        </div>
        
        <div v-if="recentSessions.length === 0" class="text-center py-4 text-gray-400">
          No sessions recorded yet. Start your first Pomodoro!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { db } from '../utils/db'

// Register Chart.js components
Chart.register(...registerables)

const chartCanvas = ref(null)
let chart = null

const stats = ref({
  today: {
    focusTime: 0,
    sessions: 0,
    tasksCompleted: 0,
    productivity: 0
  }
})

const recentSessions = ref([])

const formatSessionType = (type) => {
  const types = {
    focus: 'Focus Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  }
  return types[type] || type
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const loadStats = async () => {
  try {
    const allSessions = await db.getWeeklyStats()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Calculate today's stats
    const todaySessions = allSessions.filter(s => {
      const sessionDate = new Date(s.completedAt)
      sessionDate.setHours(0, 0, 0, 0)
      return sessionDate.getTime() === today.getTime()
    })
    
    const focusToday = todaySessions
      .filter(s => s.type === 'focus')
      .reduce((sum, s) => sum + (s.duration || 0), 0)
    
    stats.value.today = {
      focusTime: focusToday,
      sessions: todaySessions.length,
      tasksCompleted: todaySessions.length,
      productivity: todaySessions.length > 0 ? Math.min(100, Math.round((focusToday / 125) * 100)) : 0
    }
    
    // Get last 10 sessions for recent list
    recentSessions.value = allSessions.slice(-10).reverse()
  } catch (err) {
    console.error('Error loading stats:', err)
  }
}

const initChart = () => {
  if (!chartCanvas.value) return
  
  // Destroy existing chart
  if (chart) {
    chart.destroy()
  }
  
  // Calculate weekly data from sessions
  const today = new Date()
  const weeklyData = []
  const labels = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
    weeklyData.push(0) // Will update with real data
  }
  
  // Get weekly sessions and calculate daily totals
  const dailyTotals = {}
  recentSessions.value.forEach(session => {
    if (session.type === 'focus') {
      const date = new Date(session.completedAt)
      const key = date.toLocaleDateString('en-US', { weekday: 'short' })
      dailyTotals[key] = (dailyTotals[key] || 0) + (session.duration || 0)
    }
  })
  
  labels.forEach((label, idx) => {
    weeklyData[idx] = dailyTotals[label] || 0
  })
  
  chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Focus Time (min)',
        data: weeklyData,
        borderColor: '#FF69B4',
        backgroundColor: 'rgba(255, 105, 180, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6EC5E9',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#b8b8d1'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#b8b8d1'
          }
        }
      }
    }
  })
}

// Reload stats every 5 seconds for real-time updates
let statsInterval = null

onMounted(async () => {
  await loadStats()
  
  // Initialize chart after loading stats
  setTimeout(() => {
    initChart()
  }, 100)
  
  // Poll for updates every 5 seconds
  statsInterval = setInterval(async () => {
    await loadStats()
    // Reinitialize chart with new data
    setTimeout(() => {
      initChart()
    }, 50)
  }, 5000)
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
  if (statsInterval) {
    clearInterval(statsInterval)
  }
})
</script>

<style scoped>
.stats-panel {
  background: #2d2d44;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #9CA3AF;
  font-size: 0.875rem;
}

.chart-container {
  height: 12rem;
}

.session-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.session-type {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
}

.session-type.focus {
  background-color: #FF69B4;
}

.session-type.shortBreak {
  background-color: #6EC5E9;
}

.session-type.longBreak {
  background-color: #77DD77;
}
</style>