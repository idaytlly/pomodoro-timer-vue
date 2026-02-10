<template>
  <div class="candy-card h-auto w-full">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
      <h3 class="text-base sm:text-lg lg:text-xl font-bold text-candy-blue flex items-center gap-2">
        <ListBulletIcon class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <span>Today's Tasks</span>
      </h3>
      <span class="bg-candy-pink/20 text-candy-pink px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
        {{ pendingTasks }} pending
      </span>
    </div>

    <!-- Add Task Form -->
    <div class="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        type="text"
        placeholder="Add a task..."
        class="candy-input flex-1 text-sm"
      />
      <button
        @click="addTask"
        class="candy-btn bg-gradient-to-r from-candy-pink to-rose-500 hover:from-rose-500 hover:to-candy-pink w-full sm:w-auto justify-center py-2 text-xs sm:text-sm"
      >
        <PlusIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="ml-1">Add</span>
      </button>
    </div>

    <!-- Task List -->
    <div class="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto pr-1 sm:pr-2">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 transition-all duration-300 text-sm sm:text-base"
        :class="{
          'border-candy-blue': !task.completed,
          'border-candy-green': task.completed,
          'opacity-60': task.completed
        }"
      >
        <div class="flex items-start sm:items-center gap-2 sm:gap-3">
          <button
            @click="toggleTask(task.id)"
            class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 sm:mt-0"
            :class="task.completed 
              ? 'border-candy-green bg-candy-green' 
              : 'border-candy-blue hover:border-candy-pink'"
          >
            <CheckIcon v-if="task.completed" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
          
          <span
            class="flex-1 transition-all duration-300 break-words"
            :class="task.completed ? 'line-through text-gray-400' : 'text-white'"
          >
            {{ task.text }}
          </span>
          
          <button
            @click="deleteTask(task.id)"
            class="text-gray-400 hover:text-candy-pink transition-colors p-1 flex-shrink-0"
          >
            <TrashIcon class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div v-if="task.createdAt" class="text-xs text-gray-500 mt-2 ml-7 sm:ml-9">
          Added {{ formatDate(task.createdAt) }}
        </div>
      </div>
      
      <div v-if="tasks.length === 0" class="text-center py-8 sm:py-12 text-gray-400">
        <ListBulletIcon class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" />
        <p class="text-sm sm:text-base">No tasks yet. Add one above!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ListBulletIcon,
  PlusIcon, 
  CheckIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'
import { db } from '../utils/db'

const tasks = ref([])
const newTask = ref('')

const pendingTasks = computed(() => {
  return tasks.value.filter(t => !t.completed).length
})

// Auto-refresh tasks every 2 seconds
let taskInterval = null

const loadTasks = async () => {
  try {
    tasks.value = await db.getTasks()
    console.log('Tasks loaded:', tasks.value)
  } catch (err) {
    console.error('Error loading tasks:', err)
  }
}

const addTask = async () => {
  if (!newTask.value.trim()) {
    console.log('Task is empty, skipping')
    return
  }
  
  try {
    console.log('Adding task:', newTask.value)
    const task = {
      text: newTask.value.trim()
    }
    
    await db.addTask(task)
    console.log('Task added successfully')
    newTask.value = ''
    await loadTasks()
    console.log('Tasks reloaded, total:', tasks.value.length)
  } catch (err) {
    console.error('Error adding task:', err)
  }
}

const toggleTask = async (id) => {
  try {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      await db.updateTask(id, { completed: !task.completed })
      await loadTasks()
    }
  } catch (err) {
    console.error('Error toggling task:', err)
  }
}

const deleteTask = async (id) => {
  try {
    await db.deleteTask(id)
    await loadTasks()
  } catch (err) {
    console.error('Error deleting task:', err)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadTasks()
  
  // Auto-refresh tasks every 2 seconds for real-time updates
  taskInterval = setInterval(() => {
    loadTasks()
  }, 2000)
})

onUnmounted(() => {
  if (taskInterval) {
    clearInterval(taskInterval)
  }
})
</script>