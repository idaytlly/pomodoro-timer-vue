import { openDB } from 'idb'

const DB_NAME = 'candy-pomodoro-db'
const DB_VERSION = 1

let dbInstance = null

const initDB = async () => {
  if (dbInstance) {
    return dbInstance
  }
  
  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true })
          taskStore.createIndex('createdAt', 'createdAt')
          taskStore.createIndex('completed', 'completed')
        }
        
        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
          sessionStore.createIndex('date', 'date')
          sessionStore.createIndex('type', 'type')
        }
        
        // Statistics store
        if (!db.objectStoreNames.contains('stats')) {
          const statsStore = db.createObjectStore('stats', { keyPath: 'date' })
        }
        
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' })
        }
      },
    })
    console.log('Database initialized successfully')
    return dbInstance
  } catch (err) {
    console.error('Failed to initialize database:', err)
    throw err
  }
}

export const db = {
  // Task operations
  async getTasks() {
    try {
      const database = await initDB()
      const result = await database.getAll('tasks')
      console.log('Retrieved tasks from DB:', result)
      return result
    } catch (err) {
      console.error('Error getting tasks:', err)
      return []
    }
  },
  
  async addTask(task) {
    try {
      const database = await initDB()
      console.log('Adding task to DB:', task)
      const id = await database.add('tasks', {
        ...task,
        createdAt: new Date().toISOString(),
        completed: false
      })
      console.log('Task added with ID:', id)
      return id
    } catch (err) {
      console.error('Error adding task:', err)
      throw err
    }
  },
  
  async updateTask(id, updates) {
    try {
      const database = await initDB()
      const tx = database.transaction('tasks', 'readwrite')
      const store = tx.objectStore('tasks')
      const task = await store.get(id)
      await store.put({ ...task, ...updates })
      await tx.done
      console.log('Task updated:', id)
    } catch (err) {
      console.error('Error updating task:', err)
      throw err
    }
  },
  
  async deleteTask(id) {
    try {
      const database = await initDB()
      await database.delete('tasks', id)
      console.log('Task deleted:', id)
    } catch (err) {
      console.error('Error deleting task:', err)
      throw err
    }
  },
  
  // Session operations
  async addSession(session) {
    try {
      const database = await initDB()
      return database.add('sessions', {
        ...session,
        date: new Date().toISOString().split('T')[0]
      })
    } catch (err) {
      console.error('Error adding session:', err)
      throw err
    }
  },
  
  async getSessions(date) {
    try {
      const database = await initDB()
      const tx = database.transaction('sessions', 'readonly')
      const index = tx.store.index('date')
      return index.getAll(date)
    } catch (err) {
      console.error('Error getting sessions:', err)
      return []
    }
  },
  
  async getWeeklyStats() {
    try {
      const database = await initDB()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const tx = database.transaction('sessions', 'readonly')
      const store = tx.objectStore('sessions')
      const sessions = await store.getAll()
      
      return sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= sevenDaysAgo
      })
    } catch (err) {
      console.error('Error getting weekly stats:', err)
      return []
    }
  },
  
  // Settings operations
  async saveSettings(settings) {
    try {
      const database = await initDB()
      const tx = database.transaction('settings', 'readwrite')
      await tx.store.put({ id: 'userSettings', ...settings })
      await tx.done
      console.log('Settings saved')
    } catch (err) {
      console.error('Error saving settings:', err)
      throw err
    }
  },
  
  async getSettings() {
    try {
      const database = await initDB()
      return await database.get('settings', 'userSettings')
    } catch (err) {
      console.error('Error getting settings:', err)
      return null
    }
  },
  
  // Clear all data
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
      console.log('All data cleared')
    } catch (err) {
      console.error('Error clearing data:', err)
      throw err
    }
  }
}