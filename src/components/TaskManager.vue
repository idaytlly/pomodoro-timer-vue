<template>
  <div class="task-manager">
    <div class="task-header">
      <h2 class="section-title">
        <span class="title-icon">✨</span>
        Tasks
        <span class="task-count">{{ activeTasks.length }}</span>
      </h2>
      <div class="completion-badge" v-if="totalTasks > 0">
        {{ completionRate }}% Complete
      </div>
    </div>

    <!-- Add Task Input -->
    <div class="add-task-form">
      <input
        v-model="newTaskTitle"
        @keyup.enter="addTaskFromInput"
        type="text"
        placeholder="What do you want to focus on? 🎯"
        class="task-input"
        maxlength="100"
      />
      <button
        @click="addTaskFromInput"
        class="add-task-btn"
        :disabled="!newTaskTitle.trim()"
        title="Add task"
      >
        <span class="btn-icon">➕</span>
      </button>
    </div>

    <!-- Task List -->
    <div class="task-list" v-if="!isLoading && totalTasks > 0">
      <!-- Active Tasks -->
      <div class="task-section" v-if="activeTasks.length > 0">
        <h3 class="subsection-title">Active</h3>
        <TransitionGroup name="task-list" tag="div">
          <div
            v-for="task in activeTasks"
            :key="task.id"
            class="task-item"
          >
            <button
              @click="toggleComplete(task.id)"
              class="task-checkbox"
              :aria-label="`Complete task: ${task.title}`"
            >
              <span class="checkbox-icon">{{ task.completed ? '✓' : '' }}</span>
            </button>
            
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-time">
                {{ formatTime(task.createdAt) }}
              </span>
            </div>
            
            <button
              @click="deleteTask(task.id)"
              class="delete-btn"
              title="Delete task"
            >
              <span>🗑️</span>
            </button>
          </div>
        </TransitionGroup>
      </div>

      <!-- Completed Tasks -->
      <div class="task-section" v-if="completedTasks.length > 0">
        <div class="subsection-header">
          <h3 class="subsection-title">Completed</h3>
          <button
            @click="clearCompletedTasks"
            class="clear-btn"
            title="Clear all completed tasks"
          >
            Clear All
          </button>
        </div>
        <TransitionGroup name="task-list" tag="div">
          <div
            v-for="task in completedTasks"
            :key="task.id"
            class="task-item completed"
          >
            <button
              @click="toggleComplete(task.id)"
              class="task-checkbox checked"
              :aria-label="`Uncomplete task: ${task.title}`"
            >
              <span class="checkbox-icon">✓</span>
            </button>
            
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-time">
                {{ formatTime(task.completedAt) }}
              </span>
            </div>
            
            <button
              @click="deleteTask(task.id)"
              class="delete-btn"
              title="Delete task"
            >
              <span>🗑️</span>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div class="empty-state" v-else-if="!isLoading && totalTasks === 0">
      <div class="empty-icon">🍬</div>
      <p class="empty-text">No tasks yet!</p>
      <p class="empty-subtext">Add your first task to get started</p>
    </div>

    <!-- Loading State -->
    <div class="loading-state" v-if="isLoading">
      <div class="loading-spinner">🍭</div>
      <p>Loading tasks...</p>
    </div>
  </div>
</template>

<script setup>
import { useTasks } from '../composables/useTasks';

const {
  tasks,
  newTaskTitle,
  isLoading,
  activeTasks,
  completedTasks,
  totalTasks,
  completionRate,
  addTaskFromInput,
  toggleComplete,
  deleteTask,
  clearCompletedTasks
} = useTasks();

function formatTime(dateString) {
  if (!dateString) return '';
  
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
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.task-manager {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Header */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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

.task-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  background: linear-gradient(135deg, #FF69B4, #B19CD9);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.completion-badge {
  padding: 0.5rem 1rem;
  background: rgba(119, 221, 119, 0.2);
  border: 1px solid rgba(119, 221, 119, 0.3);
  border-radius: 1rem;
  color: #77DD77;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Add Task Form */
.add-task-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.task-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.task-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.task-input:focus {
  outline: none;
  border-color: #FF69B4;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.add-task-btn {
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task-btn:hover:not(:disabled) {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.5);
}

.add-task-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subsection-title {
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.clear-btn {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  border-color: rgba(255, 105, 180, 0.5);
  color: #FF69B4;
  background: rgba(255, 105, 180, 0.1);
}

/* Task Item */
.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.5);
}

/* Checkbox */
.task-checkbox {
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-checkbox:hover {
  border-color: #FF69B4;
  background: rgba(255, 105, 180, 0.1);
}

.task-checkbox.checked {
  background: linear-gradient(135deg, #77DD77, #50C878);
  border-color: #77DD77;
}

.checkbox-icon {
  font-size: 1rem;
  font-weight: bold;
}

/* Task Content */
.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.task-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Delete Button */
.delete-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: rgba(255, 69, 69, 0.2);
  color: #FF6B6B;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-text {
  font-family: 'Quicksand', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 2rem;
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

/* Transitions */
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.task-list-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .task-input {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }

  .add-task-btn {
    width: 3rem;
    height: 3rem;
  }

  .task-item {
    padding: 0.875rem 1rem;
  }
}
</style>