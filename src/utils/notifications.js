/**
 * Desktop Notifications Handler
 * Manages browser notification permissions and displays
 */

let notificationsEnabled = false;

// Request notification permission from the user
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    notificationsEnabled = true;
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    notificationsEnabled = permission === 'granted';
    return notificationsEnabled;
  }

  return false;
}

// Show a notification
export function showNotification(title, options = {}) {
  if (!notificationsEnabled || Notification.permission !== 'granted') {
    return null;
  }

  const defaultOptions = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍬</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍭</text></svg>',
    requireInteraction: false,
    silent: false,
    ...options
  };

  return new Notification(title, defaultOptions);
}

// Notification templates for different timer states
export function notifyFocusComplete() {
  return showNotification('🎉 Focus Session Complete!', {
    body: 'Great work! Time for a sweet break. 🍭',
    tag: 'pomodoro-focus-complete'
  });
}

export function notifyBreakComplete() {
  return showNotification('⏰ Break Time Over!', {
    body: 'Ready to focus again? Let\'s get back to work! 💪',
    tag: 'pomodoro-break-complete'
  });
}

export function notifyLongBreak() {
  return showNotification('🌟 Time for a Long Break!', {
    body: 'You\'ve completed 4 focus sessions. Enjoy your well-deserved rest! 🍬',
    tag: 'pomodoro-long-break'
  });
}

// Check if notifications are supported
export function isNotificationSupported() {
  return 'Notification' in window;
}

// Get current notification permission status
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Enable/disable notifications
export function setNotificationsEnabled(enabled) {
  notificationsEnabled = enabled && Notification.permission === 'granted';
  return notificationsEnabled;
}

export function areNotificationsEnabled() {
  return notificationsEnabled;
}