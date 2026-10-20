/**
 * Romantic Audio Synthesizer & Sound Effects Engine
 * Generates beautiful, copyright-free romantic melodies and tactile sound effects using Web Audio API.
 */

class RomanticAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.6;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private currentTrack: number = 0;
  private onTrackStateChange: ((playing: boolean) => void) | null = null;

  public tracks = [
    { id: 0, name: 'Canon Tình Yêu (Piano & Chime)', tempo: 68 },
    { id: 1, name: 'Giai Điệu Hoàng Hôn 20/10', tempo: 64 },
    { id: 2, name: 'Lofi Chạm Vào Tim Em', tempo: 72 },
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  public setListener(cb: (playing: boolean) => void) {
    this.onTrackStateChange = cb;
  }

  // Play a soft mellow tone with ADSR envelope
  private playPianoTone(freq: number, startTime: number, duration: number, vel: number = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm Rhodes/Piano harmonic mix
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    const peak = vel * 0.28;
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(peak, startTime + 0.03); // Quick soft attack
    gainNode.gain.exponentialRampToValueAtTime(peak * 0.6, startTime + 0.3); // Decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Release

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  // Play delicate chime
  private playChimeTone(freq: number, startTime: number, duration: number, vel: number = 0.2) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(vel * 0.15, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Track melodies
  private scheduleMelody(trackIdx: number) {
    if (!this.isPlaying) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Frequencies (Hz)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;
    const C3 = 130.81, G3 = 196.00, A3 = 220.00, F3 = 174.61, E3 = 164.81, D3 = 146.83;

    let totalDuration = 16; // seconds

    if (trackIdx === 0) {
      // Canon in D inspired romantic ballad progression in C (C - G - Am - Em - F - C - F - G)
      const chords = [
        { bass: C3, notes: [C4, E4, G4, C5], arpeggio: [C4, G4, E4, C5, G4, E5] },
        { bass: G3, notes: [B4, D4, G4, D5], arpeggio: [G4, D5, B4, G4, D4, B4] },
        { bass: A3, notes: [A4, C4, E4, C5], arpeggio: [A4, E4, C5, A4, E5, C5] },
        { bass: E3, notes: [G4, B4, E4, B4], arpeggio: [E4, B4, G4, E5, B4, G4] },
        { bass: F3, notes: [F4, A4, C5, F5], arpeggio: [F4, C5, A4, F5, C5, A4] },
        { bass: C3, notes: [E4, G4, C5, E5], arpeggio: [C4, E4, G4, C5, E5, G4] },
        { bass: F3, notes: [F4, A4, C5, D5], arpeggio: [F4, A4, D5, C5, A4, F4] },
        { bass: G3, notes: [G4, B4, D5, G5], arpeggio: [G4, B4, D5, F5, E5, D5] },
      ];

      chords.forEach((chord, i) => {
        const time = now + i * 2.0;
        // Bass tone
        this.playPianoTone(chord.bass, time, 2.0, 0.6);

        // Arpeggios
        chord.arpeggio.forEach((n, idx) => {
          this.playPianoTone(n, time + idx * 0.32, 1.2, 0.45);
          if (idx % 2 === 0) {
            this.playChimeTone(n * 2, time + idx * 0.32 + 0.05, 0.8, 0.12);
          }
        });
      });
      totalDuration = 16.0;
    } else if (trackIdx === 1) {
      // Sunset romance
      const sequence = [
        { bass: F3, arp: [F4, A4, C5, E5, C5, A4] },
        { bass: G3, arp: [G4, B4, D5, G5, D5, B4] },
        { bass: E3, arp: [E4, G4, B4, E5, B4, G4] },
        { bass: A3, arp: [A4, C5, E5, A5, E5, C5] },
      ];
      sequence.forEach((seq, i) => {
        const time = now + i * 3.5;
        this.playPianoTone(seq.bass, time, 3.4, 0.55);
        seq.arp.forEach((n, idx) => {
          this.playPianoTone(n, time + idx * 0.55, 1.8, 0.4);
          this.playChimeTone(n * 2, time + idx * 0.55, 0.9, 0.1);
        });
      });
      totalDuration = 14.0;
    } else {
      // Lofi chill & sweet
      const lofiChords = [
        { bass: C3, keys: [C4, E4, G4, B4] },
        { bass: A3, keys: [A4, C4, E4, G4] },
        { bass: D3, keys: [D4, F4, A4, C5] },
        { bass: G3, keys: [G4, B4, D4, F4] },
      ];
      lofiChords.forEach((item, i) => {
        const time = now + i * 3.0;
        this.playPianoTone(item.bass, time, 2.8, 0.6);
        item.keys.forEach((note, kIdx) => {
          this.playPianoTone(note, time + kIdx * 0.08, 2.5, 0.35);
        });
        // Decorative high chime
        this.playChimeTone(item.keys[3] * 1.5, time + 1.2, 1.2, 0.15);
      });
      totalDuration = 12.0;
    }

    // Schedule next loop smoothly
    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleMelody(this.currentTrack);
      }
    }, (totalDuration - 0.2) * 1000);
  }

  public play() {
    this.getContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.onTrackStateChange) this.onTrackStateChange(true);
    this.scheduleMelody(this.currentTrack);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.onTrackStateChange) this.onTrackStateChange(false);
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public selectTrack(index: number) {
    this.currentTrack = index % this.tracks.length;
    if (this.isPlaying) {
      if (this.timerId) clearTimeout(this.timerId);
      this.scheduleMelody(this.currentTrack);
    }
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrack;
  }

  // Interactive UI Sound Effects
  public playSparkle() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        this.playChimeTone(freq, now + idx * 0.07, 0.4, 0.22);
      });
    } catch {
      // Audio context might fail silently if user hasn't interacted
    }
  }

  public playOpenLetter() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [392.0, 440.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        this.playPianoTone(freq, now + idx * 0.06, 0.6, 0.35);
        this.playChimeTone(freq * 1.5, now + idx * 0.06, 0.4, 0.15);
      });
    } catch {
      // Ignore
    }
  }

  public playGiftFanfare() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        this.playChimeTone(freq, now + idx * 0.08, 0.9, 0.3);
      });
    } catch {
      // Ignore
    }
  }

  public playWheelTick() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Ignore
    }
  }

  public playCouponRedeem() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      this.playPianoTone(440, now, 0.3, 0.4);
      this.playPianoTone(880, now + 0.1, 0.5, 0.5);
      this.playChimeTone(1320, now + 0.15, 0.6, 0.25);
    } catch {
      // Ignore
    }
  }
}

export const audioManager = new RomanticAudioManager();
