// Enhanced notifications with IndexedDB support
export const playSound = async (type = 'complete') => {
  try {
    // Check if sound is enabled in settings
    const { db } = await import('./db.js')
    const settings = await db.getSettings()
    
    if (settings && !settings.soundEnabled) {
      return
    }
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Different frequencies for different events
    const frequencies = {
      start: 523.25, // C5
      complete: 659.25, // E5
      alert: 783.99, // G5
      pause: 392.00 // G4
    }
    
    oscillator.frequency.value = frequencies[type] || 440
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
  } catch (error) {
    console.log('Audio playback not supported or failed:', error)
    
    // Fallback to HTML5 audio
    try {
      const audio = new Audio()
      const sounds = {
        start: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
        complete: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
        alert: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'
      }
      
      audio.src = sounds[type] || sounds.complete
      audio.volume = 0.3
      await audio.play()
    } catch (fallbackError) {
      console.log('Fallback audio also failed:', fallbackError)
    }
  }
}

export const notify = async (title, body) => {
  try {
    // Check if notifications are enabled in settings
    const { db } = await import('./db.js')
    const settings = await db.getSettings()
    
    if (settings && !settings.desktopNotifications) {
      return
    }
    
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return
    }
    
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'pomodoro-notification',
        requireInteraction: false
      })
    } else if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification(title, { body })
      }
    }
  } catch (error) {
    console.error('Error showing notification:', error)
  }
}

// Vibrate if supported (for mobile)
export const vibrate = async (pattern = [200, 100, 200]) => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch (error) {
      console.log('Vibration not supported')
    }
  }
}