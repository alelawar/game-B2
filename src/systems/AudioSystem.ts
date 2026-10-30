// Web Audio API Procedural Synthesizer for 16-bit retro RPG sounds
class AudioSystemManager {
  private static instance: AudioSystemManager;
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private constructor() {}

  public static getInstance(): AudioSystemManager {
    if (!AudioSystemManager.instance) {
      AudioSystemManager.instance = new AudioSystemManager();
    }
    return AudioSystemManager.instance;
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public playSwing(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  public playHit(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  public playPlayerHurt(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  public playCorrect(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Upward cheerful arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  public playIncorrect(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [260, 220];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  public playInteract(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  public playKeyFound(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Upward treasure/key fanfare chime: D5 -> F#5 -> A5 -> D6 -> F#6 -> A6
    const notes = [
      { f: 587.33, d: 0.09 },
      { f: 739.99, d: 0.09 },
      { f: 880.00, d: 0.09 },
      { f: 1174.66, d: 0.12 },
      { f: 1479.98, d: 0.14 },
      { f: 1760.00, d: 0.50 }
    ];

    let t = ctx.currentTime;
    notes.forEach((item, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(item.f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.d + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + item.d + 0.05);

      // High shimmer sparkle overtone on the final sustained note
      if (idx === notes.length - 1) {
        const shimmer = ctx.createOscillator();
        const sGain = ctx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(item.f * 2, t);
        sGain.gain.setValueAtTime(0, t);
        sGain.gain.linearRampToValueAtTime(0.15, t + 0.03);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + item.d);
        shimmer.connect(sGain);
        sGain.connect(ctx.destination);
        shimmer.start(t);
        shimmer.stop(t + item.d + 0.05);
      }

      t += item.d * 0.85;
    });
  }

  public playCrownFound(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  public playVictory(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.3 },
      { f: 783.99, d: 0.3 },
      { f: 1046.50, d: 0.6 }
    ];

    let t = ctx.currentTime;
    notes.forEach(item => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + item.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + item.d);

      t += item.d + 0.04;
    });
  }
}

export const AudioSystem = AudioSystemManager.getInstance();
