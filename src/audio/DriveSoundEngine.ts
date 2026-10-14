// Web Audio API Synthesizer for Authentic Optical Drive & Generative Music

class SoundEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private currentMusicNodes: { stop: () => void } | null = null
  private isPlayingTrack: boolean = false

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.isMuted && this.currentMusicNodes) {
      this.stopMusic()
    }
    return !this.isMuted
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  // Synthesizes authentic vintage CRT TV power-off collapse + static glitch pop
  public playCrtGlitch() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 1. Static burst (white noise buffer with fast decay)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08))
    }
    const noiseSource = this.ctx.createBufferSource()
    noiseSource.buffer = buffer

    const noiseFilter = this.ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(2200, now)
    noiseFilter.Q.setValueAtTime(1.5, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.18, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    noiseSource.start(now)

    // 2. High-pitch CRT horizontal flyback whine drop (12kHz down to 180Hz)
    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(11000, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22)

    oscGain.gain.setValueAtTime(0.06, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)

    osc.connect(oscGain)
    oscGain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Synthesizes the motorized tray sliding out (hum + mechanical clack)
  public playTrayOpen() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Motor hum
    const motorOsc = this.ctx.createOscillator()
    const motorGain = this.ctx.createGain()
    const motorFilter = this.ctx.createBiquadFilter()

    motorOsc.type = 'sawtooth'
    motorOsc.frequency.setValueAtTime(140, now)
    motorOsc.frequency.linearRampToValueAtTime(110, now + 0.55)

    motorFilter.type = 'lowpass'
    motorFilter.frequency.setValueAtTime(500, now)

    motorGain.gain.setValueAtTime(0.01, now)
    motorGain.gain.linearRampToValueAtTime(0.09, now + 0.05)
    motorGain.gain.setValueAtTime(0.09, now + 0.48)
    motorGain.gain.linearRampToValueAtTime(0.001, now + 0.55)

    motorOsc.connect(motorFilter)
    motorFilter.connect(motorGain)
    motorGain.connect(this.ctx.destination)

    motorOsc.start(now)
    motorOsc.stop(now + 0.55)

    // Mechanical end stop clack
    const clackOsc = this.ctx.createOscillator()
    const clackGain = this.ctx.createGain()
    clackOsc.type = 'square'
    clackOsc.frequency.setValueAtTime(320, now + 0.5)
    clackOsc.frequency.exponentialRampToValueAtTime(60, now + 0.58)

    clackGain.gain.setValueAtTime(0, now)
    clackGain.gain.setValueAtTime(0.12, now + 0.5)
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58)

    clackOsc.connect(clackGain)
    clackGain.connect(this.ctx.destination)

    clackOsc.start(now + 0.5)
    clackOsc.stop(now + 0.59)
  }

  // Synthesizes the motorized tray closing & snapping shut
  public playTrayClose() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Motor hum closing
    const motorOsc = this.ctx.createOscillator()
    const motorGain = this.ctx.createGain()
    const motorFilter = this.ctx.createBiquadFilter()

    motorOsc.type = 'sawtooth'
    motorOsc.frequency.setValueAtTime(120, now)
    motorOsc.frequency.linearRampToValueAtTime(155, now + 0.52)

    motorFilter.type = 'lowpass'
    motorFilter.frequency.setValueAtTime(600, now)

    motorGain.gain.setValueAtTime(0.01, now)
    motorGain.gain.linearRampToValueAtTime(0.09, now + 0.04)
    motorGain.gain.setValueAtTime(0.09, now + 0.45)
    motorGain.gain.linearRampToValueAtTime(0.001, now + 0.52)

    motorOsc.connect(motorFilter)
    motorFilter.connect(motorGain)
    motorGain.connect(this.ctx.destination)

    motorOsc.start(now)
    motorOsc.stop(now + 0.52)

    // Sharp latch clunk
    const clunkOsc = this.ctx.createOscillator()
    const clunkGain = this.ctx.createGain()
    clunkOsc.type = 'triangle'
    clunkOsc.frequency.setValueAtTime(180, now + 0.48)
    clunkOsc.frequency.exponentialRampToValueAtTime(40, now + 0.58)

    clunkGain.gain.setValueAtTime(0, now)
    clunkGain.gain.setValueAtTime(0.2, now + 0.48)
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    clunkOsc.connect(clunkGain)
    clunkGain.connect(this.ctx.destination)

    clunkOsc.start(now + 0.48)
    clunkOsc.stop(now + 0.6)
  }

  // Soft tactile plastic tick when a disc is picked up
  public playDiscPickup() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.05)
  }

  // Soft tactile plastic tap when a disc is placed or dropped
  public playDiscDrop() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.06)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.07)
  }

  // Soft acrylic jewel case click when hovering
  public playCaseHover() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.025)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }

  // Crisp plastic snap when jewel case is clicked or focused
  public playCaseClick() {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.045)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.05)
  }

  // Synthesizes the optical drive spindle spin-up whining acceleration
  public playSpinUp(onReady?: () => void) {
    try {
      this.initContext()
    } catch {
      // ignore
    }

    if (this.isMuted || !this.ctx) {
      if (onReady) setTimeout(onReady, 1000)
      return
    }

    const now = this.ctx.currentTime

    // High turbine pitch whine
    const spinOsc = this.ctx.createOscillator()
    const spinGain = this.ctx.createGain()
    spinOsc.type = 'sine'
    spinOsc.frequency.setValueAtTime(200, now)
    spinOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.9)
    spinOsc.frequency.setValueAtTime(2400, now + 1.2)

    spinGain.gain.setValueAtTime(0.01, now)
    spinGain.gain.linearRampToValueAtTime(0.08, now + 0.4)
    spinGain.gain.exponentialRampToValueAtTime(0.015, now + 1.3)

    spinOsc.connect(spinGain)
    spinGain.connect(this.ctx.destination)

    spinOsc.start(now)
    spinOsc.stop(now + 1.4)

    // Laser optical seek ticks (ch-ch-ch-tick)
    const tickTimes = [0.45, 0.6, 0.72, 0.95, 1.1]
    tickTimes.forEach((t) => {
      if (!this.ctx) return
      const tick = this.ctx.createOscillator()
      const tickG = this.ctx.createGain()
      tick.type = 'square'
      tick.frequency.setValueAtTime(800 + Math.random() * 400, now + t)
      tickG.gain.setValueAtTime(0.06, now + t)
      tickG.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.04)
      tick.connect(tickG)
      tickG.connect(this.ctx.destination)
      tick.start(now + t)
      tick.stop(now + t + 0.05)
    })

    if (onReady) {
      setTimeout(onReady, 650)
    }
  }

  // Generative music synthesizer playing tailored tracks for each disc
  public playMusic(discId: number) {
    if (this.isMuted) return
    this.stopMusic()
    this.initContext()
    if (!this.ctx) return

    this.isPlayingTrack = true
    const ctx = this.ctx
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.16, ctx.currentTime)
    masterGain.connect(ctx.destination)

    // Create periodic musical riffs based on discId
    let isRunning = true
    const tempoMap: Record<number, number> = {
      1: 155, // Punk Riot Fast
      2: 128, // Dark EBM Techno
      3: 140, // Post-Punk Grunge
      4: 170, // Breakbeat Hardcore
      5: 110, // Lo-Fi Tape Noise
    }
    const bpm = tempoMap[discId] || 135
    const stepDuration = 60 / bpm / 2 // eighth notes
    let step = 0

    // Scales
    const bassNotes: Record<number, number[]> = {
      1: [65.41, 73.42, 87.31, 98.0], // C2, D2, F2, G2 (Fast punk bass)
      2: [55.0, 58.27, 65.41, 73.42],  // A1, Bb1, C2, D2 (Industrial EBM)
      3: [73.42, 82.41, 87.31, 110.0], // D2, E2, F2, A2 (Grungy bass)
      4: [48.99, 58.27, 65.41, 82.41], // G1, Bb1, C2, E2 (Sub bass)
      5: [65.41, 82.41, 98.0, 116.54], // C2, E2, G2, Bb2 (Tape drone)
    }
    const notes = bassNotes[discId] || bassNotes[1]

    const intervalId = window.setInterval(() => {
      if (!isRunning || !this.ctx || this.isMuted) return
      const t = this.ctx.currentTime

      // Kick drum on beats 0, 4, 8, 12
      if (step % 4 === 0) {
        const kickOsc = ctx.createOscillator()
        const kickGain = ctx.createGain()
        kickOsc.frequency.setValueAtTime(160, t)
        kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.12)
        kickGain.gain.setValueAtTime(0.4, t)
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
        kickOsc.connect(kickGain)
        kickGain.connect(masterGain)
        kickOsc.start(t)
        kickOsc.stop(t + 0.26)
      }

      // Snare / clap on beats 2, 6, 10, 14
      if (step % 8 === 4) {
        const snareOsc = ctx.createOscillator()
        const snareGain = ctx.createGain()
        snareOsc.type = 'triangle'
        snareOsc.frequency.setValueAtTime(260, t)
        snareOsc.frequency.exponentialRampToValueAtTime(80, t + 0.15)
        snareGain.gain.setValueAtTime(0.2, t)
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
        snareOsc.connect(snareGain)
        snareGain.connect(masterGain)
        snareOsc.start(t)
        snareOsc.stop(t + 0.19)
      }

      // Distorted bass synthesizer
      const noteFreq = notes[step % notes.length]
      const bassOsc = ctx.createOscillator()
      const bassGain = ctx.createGain()
      const distortionFilter = ctx.createBiquadFilter()

      bassOsc.type = discId === 2 ? 'sawtooth' : 'triangle'
      bassOsc.frequency.setValueAtTime(noteFreq, t)

      distortionFilter.type = 'lowpass'
      distortionFilter.frequency.setValueAtTime(discId === 1 ? 1200 : 700, t)
      distortionFilter.Q.setValueAtTime(4, t)

      bassGain.gain.setValueAtTime(0.22, t)
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + stepDuration * 0.9)

      bassOsc.connect(distortionFilter)
      distortionFilter.connect(bassGain)
      bassGain.connect(masterGain)

      bassOsc.start(t)
      bassOsc.stop(t + stepDuration)

      step = (step + 1) % 16
    }, stepDuration * 1000)

    this.currentMusicNodes = {
      stop: () => {
        isRunning = false
        window.clearInterval(intervalId)
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3)
      },
    }
  }

  public stopMusic() {
    this.isPlayingTrack = false
    if (this.currentMusicNodes) {
      this.currentMusicNodes.stop()
      this.currentMusicNodes = null
    }
  }

  public isPlaying(): boolean {
    return this.isPlayingTrack
  }
}

export const soundEngine = new SoundEngine()
