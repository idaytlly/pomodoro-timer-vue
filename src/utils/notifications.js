// Notification and audio utilities
export const playSound = (type = 'complete') => {
  const audio = new Audio()
  
  // Different sounds for different events
  const sounds = {
    start: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
    complete: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
    alert: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'
  }
  
  audio.src = sounds[type] || sounds.complete
  audio.play().catch(e => console.log('Audio playback failed:', e))
}

export const notify = (title, body) => {
  if (!('Notification' in window)) return
  
  if (Notification.permission === 'granted') {
    new Notification(title, { body })
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body })
      }
    })
  }
}