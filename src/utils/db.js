import { openDB } from 'idb'

const DB_NAME = 'candy-pomodoro-db'
const DB_VERSION = 2

let dbInstance = null

const initDB = async () => {
  if (dbInstance) return dbInstance
  
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Upgrading database from ${oldVersion} to ${newVersion}`)
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true })
        taskStore.createIndex('createdAt', 'createdAt')
        taskStore.createIndex('completed', 'completed')
        taskStore.createIndex('date', 'date')
      }
      
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
        sessionStore.createIndex('date', 'date')
        sessionStore.createIndex('type', 'type')
        sessionStore.createIndex('createdAt', 'createdAt')
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
      
      if (!db.objectStoreNames.contains('stats')) {
        db.createObjectStore('stats', { keyPath: 'date' })
      }
    },
  })
  
  return dbInstance
}

export const db = {
  // ========== TASK OPERATIONS ==========
  async getTasks(date = null) {
    try {
      const database = await initDB()
      if (date) {
        const tx = database.transaction('tasks', 'readonly')
        const index = tx.store.index('date')
        return index.getAll(date)
      }
      return database.getAll('tasks')
    } catch (error) {
      console.error('Error getting tasks:', error)
      return []
    }
  },
  
  async addTask(task) {
    try {
      const database = await initDB()
      const taskWithDate = {
        ...task,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        completed: task.completed || false
      }
      return await database.add('tasks', taskWithDate)
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  },
  
  async updateTask(id, updates) {
    try {
      const database = await initDB()
      const tx = database.transaction('tasks', 'readwrite')
      const store = tx.objectStore('tasks')
      const task = await store.get(id)
      
      if (task) {
        const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() }
        await store.put(updatedTask)
        await tx.done
        return updatedTask
      }
      return null
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },
  
  async deleteTask(id) {
    try {
      const database = await initDB()
      return database.delete('tasks', id)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },
  
  async clearCompletedTasks() {
    try {
      const database = await initDB()
      const tx = database.transaction('tasks', 'readwrite')
      const store = tx.objectStore('tasks')
      const index = store.index('completed')
      const completedTasks = await index.getAll(true)
      
      await Promise.all(completedTasks.map(task => store.delete(task.id)))
      await tx.done
      return completedTasks.length
    } catch (error) {
      console.error('Error clearing completed tasks:', error)
      throw error
    }
  },
  
  // ========== SESSION OPERATIONS ==========
  async addSession(session) {
    try {
      const database = await initDB()
      const sessionWithDate = {
        ...session,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        completedAt: session.completedAt || new Date().toISOString()
      }
      return await database.add('sessions', sessionWithDate)
    } catch (error) {
      console.error('Error adding session:', error)
      throw error
    }
  },
  
  async getSessions(date = null) {
    try {
      const database = await initDB()
      if (date) {
        const tx = database.transaction('sessions', 'readonly')
        const index = tx.store.index('date')
        return index.getAll(date)
      }
      return database.getAll('sessions')
    } catch (error) {
      console.error('Error getting sessions:', error)
      return []
    }
  },
  
  async getTodaySessions() {
    try {
      const today = new Date().toISOString().split('T')[0]
      return this.getSessions(today)
    } catch (error) {
      console.error('Error getting today sessions:', error)
      return []
    }
  },
  
  async getWeeklySessions() {
    try {
      const database = await initDB()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const allSessions = await database.getAll('sessions')
      return allSessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= sevenDaysAgo
      })
    } catch (error) {
      console.error('Error getting weekly sessions:', error)
      return []
    }
  },
  
  async getWeeklyStats() {
    try {
      const sessions = await this.getWeeklySessions()
      const weeklyData = new Array(7).fill(0)
      
      sessions.forEach(session => {
        if (session.type === 'focus') {
          const date = new Date(session.date)
          const day = date.getDay()
          weeklyData[day] += session.duration || 25
        }
      })
      
      // Reorder to start from Monday
      return weeklyData.slice().concat(weeklyData).slice(1, 8)
    } catch (error) {
      console.error('Error getting weekly stats:', error)
      return [0, 0, 0, 0, 0, 0, 0]
    }
  },
  
  // ========== STATISTICS OPERATIONS ==========
  async getTodayStats() {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Get today's sessions
      const sessions = await this.getSessions(today)
      const focusSessions = sessions.filter(s => s.type === 'focus')
      const totalFocusTime = focusSessions.reduce((sum, s) => sum + (s.duration || 25), 0)
      
      // Get today's tasks
      const tasks = await this.getTasks(today)
      const completedTasks = tasks.filter(t => t.completed).length
      
      return {
        focusTime: totalFocusTime,
        sessions: focusSessions.length,
        tasksCompleted: completedTasks,
        productivity: focusSessions.length > 0 
          ? Math.min(100, Math.floor((totalFocusTime / (focusSessions.length * 25)) * 100))
          : 0
      }
    } catch (error) {
      console.error('Error getting today stats:', error)
      return {
        focusTime: 0,
        sessions: 0,
        tasksCompleted: 0,
        productivity: 0
      }
    }
  },
  
  // ========== SETTINGS OPERATIONS ==========
  async saveSettings(settings) {
    try {
      const database = await initDB()
      const tx = database.transaction('settings', 'readwrite')
      await tx.store.put({ key: 'userSettings', value: settings })
      await tx.done
      return settings
    } catch (error) {
      console.error('Error saving settings:', error)
      throw error
    }
  },
  
  async getSettings() {
    try {
      const database = await initDB()
      const settings = await database.get('settings', 'userSettings')
      return settings ? settings.value : null
    } catch (error) {
      console.error('Error getting settings:', error)
      return null
    }
  },
  
  // ========== DATA MANAGEMENT ==========
  async clearAllData() {
    try {
      const database = await initDB()
      const tx = database.transaction(['tasks', 'sessions', 'stats'], 'readwrite')
      
      await Promise.all([
        tx.objectStore('tasks').clear(),
        tx.objectStore('sessions').clear(),
        tx.objectStore('stats').clear()
      ])
      
      await tx.done
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      throw error
    }
  },
  
  async exportData() {
    try {
      const database = await initDB()
      const [tasks, sessions, settings] = await Promise.all([
        database.getAll('tasks'),
        database.getAll('sessions'),
        database.getAll('settings')
      ])
      
      return {
        version: DB_VERSION,
        exportedAt: new Date().toISOString(),
        tasks,
        sessions,
        settings
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  },
  
  async importData(data) {
    try {
      await this.clearAllData()
      const database = await initDB()
      const tx = database.transaction(['tasks', 'sessions', 'settings'], 'readwrite')
      
      if (data.tasks) {
        await Promise.all(data.tasks.map(task => tx.objectStore('tasks').add(task)))
      }
      
      if (data.sessions) {
        await Promise.all(data.sessions.map(session => tx.objectStore('sessions').add(session)))
      }
      
      if (data.settings) {
        await Promise.all(data.settings.map(setting => tx.objectStore('settings').add(setting)))
      }
      
      await tx.done
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }
}