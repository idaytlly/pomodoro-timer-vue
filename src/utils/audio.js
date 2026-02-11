/**
 * Audio Handler for Timer Sounds
 * Uses Web Audio API to generate pleasant notification sounds
 */

let audioContext = null;
let soundEnabled = true;

// Initialize Audio Context (lazily created on first use)
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Generate a pleasant "ding" sound using oscillators
function playTone(frequency, duration, type = 'sine') {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// Play a delightful completion chime (3 ascending notes)
export function playCompletionSound() {
  if (!soundEnabled) return;

  // Sweet candy-like chime progression
  setTimeout(() => playTone(523.25, 0.15), 0);    // C5
  setTimeout(() => playTone(659.25, 0.15), 100);  // E5
  setTimeout(() => playTone(783.99, 0.3), 200);   // G5
}

// Play a gentle tick sound
export function playTickSound() {
  if (!soundEnabled) return;
  playTone(800, 0.05, 'square');
}

// Play a notification bell
export function playNotificationSound() {
  if (!soundEnabled) return;
  
  // Two-tone bell sound
  setTimeout(() => playTone(880, 0.2), 0);    // A5
  setTimeout(() => playTone(1046.5, 0.3), 150); // C6
}

// Play a button click sound
export function playClickSound() {
  if (!soundEnabled) return;
  playTone(400, 0.05, 'square');
}

// Play success sound (for completing tasks)
export function playSuccessSound() {
  if (!soundEnabled) return;
  
  // Cheerful success melody
  setTimeout(() => playTone(523.25, 0.1), 0);     // C5
  setTimeout(() => playTone(659.25, 0.1), 80);    // E5
  setTimeout(() => playTone(783.99, 0.1), 160);   // G5
  setTimeout(() => playTone(1046.5, 0.25), 240);  // C6
}

// Play a soft warning sound
export function playWarningSound() {
  if (!soundEnabled) return;
  
  setTimeout(() => playTone(440, 0.15), 0);   // A4
  setTimeout(() => playTone(440, 0.15), 200); // A4 (repeat)
}

// Enable/disable sounds
export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

// Resume audio context (needed for some browsers after user interaction)
export async function resumeAudioContext() {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}