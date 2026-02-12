/**
 * Tasks Composable - Task Management Logic (IMPROVED & BUG-FIXED)
 * Handles CRUD operations for tasks with IndexedDB persistence
 */
import { ref, computed, onMounted } from 'vue';
import {
  getAllTasks,
  addTask as dbAddTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  toggleTaskComplete as dbToggleTaskComplete
} from '../utils/db';
import { playSuccessSound, playClickSound } from '../utils/audio';

export function useTasks() {
  const tasks = ref([]);
  const newTaskTitle = ref('');
  const isLoading = ref(true);

  // ----------------------------
  // Computed Properties
  // ----------------------------
  const activeTasks = computed(() => {
    return tasks.value.filter(task => !task.completed);
  });

  const completedTasks = computed(() => {
    return tasks.value.filter(task => task.completed);
  });

  const totalTasks = computed(() => tasks.value.length);

  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0;
    return Math.round((completedTasks.value.length / totalTasks.value) * 100);
  });

  // ----------------------------
  // Task Operations
  // ----------------------------
  async function loadTasks() {
    try {
      isLoading.value = true;
      tasks.value = await getAllTasks();

      // Sort by creation date, newest first
      tasks.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error loading tasks:', error);
      tasks.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * ✅ addTask() - Works with App.vue which calls addTask() without args
   */
  async function addTask() {
    const title = newTaskTitle.value;

    if (!title || !title.trim()) {
      return false;
    }

    try {
      await dbAddTask({ title: title.trim() });

      newTaskTitle.value = '';
      await loadTasks();
      playClickSound();

      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  }

  /**
   * ✅ addTaskFromInput() - FIXED for TaskManager.vue compatibility
   */
  async function addTaskFromInput() {
    return await addTask();
  }

  /**
   * ✅ toggleTask() - App.vue compatible: toggleTask(task.id)
   */
  async function toggleTask(taskId) {
    try {
      const task = await dbToggleTaskComplete(taskId);
      await loadTasks();

      if (task && task.completed) {
        playSuccessSound();
      } else {
        playClickSound();
      }

      return task;
    } catch (error) {
      console.error('Error toggling task:', error);
      return null;
    }
  }

  /**
   * ✅ toggleComplete() - FIXED for TaskManager.vue compatibility
   */
  async function toggleComplete(taskId) {
    return await toggleTask(taskId);
  }

  async function deleteTask(taskId) {
    try {
      await dbDeleteTask(taskId);
      await loadTasks();
      playClickSound();
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  async function updateTask(taskId, updates) {
    try {
      await dbUpdateTask(taskId, updates);
      await loadTasks();
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  }

  async function clearCompletedTasks() {
    try {
      const completedIds = completedTasks.value.map(task => task.id);
      await Promise.all(completedIds.map(id => dbDeleteTask(id)));
      await loadTasks();
      playClickSound();
      return true;
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
      return false;
    }
  }

  // ----------------------------
  // Initialize
  // ----------------------------
  onMounted(() => {
    loadTasks();
  });

  return {
    // State
    tasks,
    newTaskTitle,
    isLoading,

    // Computed
    activeTasks,
    completedTasks,
    totalTasks,
    completionRate,

    // Methods (BOTH function names exported for compatibility)
    loadTasks,
    addTask,
    addTaskFromInput, // ✅ FIXED
    toggleTask,
    toggleComplete,   // ✅ FIXED
    deleteTask,
    updateTask,
    clearCompletedTasks
  };
}