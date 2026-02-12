/**
 * IndexedDB Database Wrapper
 * Handles persistent storage for tasks, sessions, settings, and statistics
 */

import { openDB } from 'idb';

const DB_NAME = 'PomodoroTimerDB';
const DB_VERSION = 1;

let dbPromise = null;

/**
 * ✅ Initialize DB ONCE (cached)
 * This prevents race conditions + random "store undefined" issues
 */
export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', {
            keyPath: 'id',
            autoIncrement: true
          });
          taskStore.createIndex('completed', 'completed');
          taskStore.createIndex('createdAt', 'createdAt');
        }

        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', {
            keyPath: 'id',
            autoIncrement: true
          });
          sessionStore.createIndex('date', 'date');
          sessionStore.createIndex('type', 'type');
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Statistics store
        if (!db.objectStoreNames.contains('stats')) {
          const statsStore = db.createObjectStore('stats', { keyPath: 'date' });
          statsStore.createIndex('date', 'date');
        }
      }
    });
  }

  return dbPromise;
}

// ==================== TASKS CRUD ====================

export async function addTask(task) {
  const db = await initDB();

  const taskData = {
    title: task.title,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  return db.add('tasks', taskData);
}

export async function getAllTasks() {
  const db = await initDB();
  return db.getAll('tasks');
}

export async function updateTask(id, updates) {
  const db = await initDB();
  const task = await db.get('tasks', id);
  if (!task) return null;

  const updatedTask = { ...task, ...updates };
  await db.put('tasks', updatedTask);
  return updatedTask;
}

export async function deleteTask(id) {
  const db = await initDB();
  return db.delete('tasks', id);
}

export async function toggleTaskComplete(id) {
  const db = await initDB();
  const task = await db.get('tasks', id);
  if (!task) return null;

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  await db.put('tasks', task);
  return task;
}

// ==================== SESSIONS ====================

export async function addSession(sessionData) {
  const db = await initDB();

  const session = {
    type: sessionData.type,
    duration: sessionData.duration,
    completedAt: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0]
  };

  return db.add('sessions', session);
}

export async function getSessionsByDateRange(startDate, endDate) {
  const db = await initDB();

  // Get all sessions and filter (safe + simple)
  const sessions = await db.getAll('sessions');

  return sessions.filter(session => {
    return session.date >= startDate && session.date <= endDate;
  });
}

export async function getRecentSessions(limit = 10) {
  const db = await initDB();
  const sessions = await db.getAll('sessions');
  return sessions.slice(-limit).reverse();
}

// ==================== SETTINGS ====================

export async function getSetting(key, defaultValue = null) {
  const db = await initDB();
  const setting = await db.get('settings', key);
  return setting ? setting.value : defaultValue;
}

export async function setSetting(key, value) {
  const db = await initDB();
  return db.put('settings', { key, value });
}

export async function getAllSettings() {
  const db = await initDB();
  const settings = await db.getAll('settings');

  return settings.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}

// ==================== STATISTICS ====================

export async function updateDailyStats(date, focusMinutes) {
  const db = await initDB();
  const dateStr = date || new Date().toISOString().split('T')[0];

  let stats = await db.get('stats', dateStr);

  if (!stats) {
    stats = {
      date: dateStr,
      focusMinutes: 0,
      sessionCount: 0,
      completedTasks: 0
    };
  }

  stats.focusMinutes += focusMinutes;
  stats.sessionCount += 1;

  await db.put('stats', stats);
  return stats;
}

export async function getWeeklyStats() {
  const db = await initDB();

  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const allStats = await db.getAll('stats');

  return allStats.filter(stat => {
    const statDate = new Date(stat.date);
    return statDate >= lastWeek && statDate <= today;
  });
}

export async function getStatsByDate(date) {
  const db = await initDB();
  return db.get('stats', date);
}

// ==================== UTILITY FUNCTIONS ====================

export async function clearAllData() {
  const db = await initDB();
  const tx = db.transaction(['tasks', 'sessions', 'settings', 'stats'], 'readwrite');

  await Promise.all([
    tx.objectStore('tasks').clear(),
    tx.objectStore('sessions').clear(),
    tx.objectStore('settings').clear(),
    tx.objectStore('stats').clear()
  ]);

  await tx.done;
}

export async function exportData() {
  const db = await initDB();

  return {
    tasks: await db.getAll('tasks'),
    sessions: await db.getAll('sessions'),
    settings: await db.getAll('settings'),
    stats: await db.getAll('stats'),
    exportedAt: new Date().toISOString()
  };
}