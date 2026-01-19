type SoundType = 'success' | 'info' | 'warning'

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private lastPlayTime: Map<SoundType, number> = new Map()
  private readonly DEBOUNCE_MS = 100 // Prevent overlapping sounds

  constructor() {
    // Note: Sound files should be added to public/sounds/
    // For now, we'll use data URLs with simple beep tones
    this.initializeSounds()
  }

  private initializeSounds() {
    // Create simple beep sounds using Web Audio API
    // In production, replace with actual audio files
    this.createBeep('success', 800, 0.15, 200)
    this.createBeep('info', 600, 0.12, 150)
    this.createBeep('warning', 400, 0.18, 250)
  }

  private createBeep(type: SoundType, frequency: number, volume: number, duration: number) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create a simple beep sound
      const createSound = () => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration / 1000
        )

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration / 1000)
      }

      // Store a wrapper function
      const audio = {
        play: () => {
          if (this.enabled) {
            createSound()
          }
          return Promise.resolve()
        },
        currentTime: 0
      } as HTMLAudioElement

      this.sounds.set(type, audio)
    } catch (error) {
      console.warn(`Failed to create ${type} sound:`, error)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  play(sound: SoundType) {
    if (!this.enabled) return

    // Debounce to prevent overlapping sounds
    const now = Date.now()
    const lastPlay = this.lastPlayTime.get(sound) || 0

    if (now - lastPlay < this.DEBOUNCE_MS) {
      return
    }

    const audio = this.sounds.get(sound)
    if (audio) {
      this.lastPlayTime.set(sound, now)
      audio.play().catch(err => {
        console.log('Sound play failed:', err)
      })
    }
  }
}

export const soundService = new SoundService()
