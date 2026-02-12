/**
 * Statistics Composable - Data Analytics and Dashboard Logic
 * Manages session history, daily stats, weekly trends, and ring clock progress
 */
import { ref, computed, onMounted } from 'vue';
import {
  getWeeklyStats,
  getStatsByDate,
  getRecentSessions
} from '../utils/db';

export function useStatistics() {
  const weeklyStats = ref([]);
  const todayStats = ref(null);
  const recentSessions = ref([]);
  const isLoading = ref(true);

  // -------------------------------
  // Ring Clock / Dashboard Computed
  // -------------------------------
  const todayFocusMinutes = computed(() => todayStats.value?.focusMinutes || 0);
  const todaySessionCount = computed(() => todayStats.value?.sessionCount || 0);

  const todayFocusGoal = 480; // 8 hours per day goal in minutes
  const todayProgressPercent = computed(() => {
    return Math.min(Math.round((todayFocusMinutes.value / todayFocusGoal) * 100), 100);
  });

  const weeklyFocusMinutes = computed(() => {
    return weeklyStats.value.reduce((sum, day) => sum + (day.focusMinutes || 0), 0);
  });

  const weeklySessionCount = computed(() => {
    return weeklyStats.value.reduce((sum, day) => sum + (day.sessionCount || 0), 0);
  });

  const weeklyGoalMinutes = 2400; // 5 days x 8 hours
  const weeklyGoalProgress = computed(() => {
    return Math.min(Math.round((weeklyFocusMinutes.value / weeklyGoalMinutes) * 100), 100);
  });

  const productivityPercentage = computed(() => {
    const averagePerDay = weeklyFocusMinutes.value / 7;
    return Math.min(Math.round((averagePerDay / todayFocusGoal) * 100), 100);
  });

  // -------------------------------
  // Chart Data for Dashboard
  // -------------------------------
  const chartData = computed(() => {
    const last7Days = getLast7Days();
    const data = last7Days.map(date => {
      const stat = weeklyStats.value.find(s => s.date === date);
      return {
        date: formatDateShort(date),
        minutes: stat?.focusMinutes || 0,
        sessions: stat?.sessionCount || 0
      };
    });

    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Focus Minutes',
          data: data.map(d => d.minutes),
          borderColor: '#FF69B4',
          backgroundColor: 'rgba(255, 105, 180, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#FF69B4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    };
  });

  const sessionChartData = computed(() => {
    const last7Days = getLast7Days();
    const data = last7Days.map(date => {
      const stat = weeklyStats.value.find(s => s.date === date);
      return {
        date: formatDateShort(date),
        sessions: stat?.sessionCount || 0
      };
    });

    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Sessions',
          data: data.map(d => d.sessions),
          borderColor: '#6EC5E9',
          backgroundColor: 'rgba(110, 197, 233, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#6EC5E9',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    };
  });

  // -------------------------------
  // Helper Functions
  // -------------------------------
  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }

  function formatDateShort(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) return 'Today';
    if (dateString === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function formatSessionType(type) {
    switch (type) {
      case 'focus': return '🎯 Focus';
      case 'shortBreak': return '☕ Short Break';
      case 'longBreak': return '🌟 Long Break';
      default: return type;
    }
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  }

  // -------------------------------
  // Data Loading
  // -------------------------------
  async function loadStatistics() {
    try {
      isLoading.value = true;
      weeklyStats.value = await getWeeklyStats();
      const today = new Date().toISOString().split('T')[0];
      todayStats.value = await getStatsByDate(today);
      recentSessions.value = await getRecentSessions(10);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshStats() {
    await loadStatistics();
  }

  // -------------------------------
  // Initialize
  // -------------------------------
  onMounted(() => {
    loadStatistics();
  });

  return {
    // State
    weeklyStats,
    todayStats,
    recentSessions,
    isLoading,

    // Computed
    todayFocusMinutes,
    todaySessionCount,
    todayProgressPercent,
    weeklyFocusMinutes,
    weeklySessionCount,
    productivityPercentage,
    weeklyGoalProgress,
    chartData,
    sessionChartData,

    // Methods
    loadStatistics,
    refreshStats,
    formatSessionType,
    formatTimeAgo,
    formatDateShort
  };
}