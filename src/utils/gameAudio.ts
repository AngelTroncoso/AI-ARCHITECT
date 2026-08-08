// Web Audio API Video Game Soundtrack Synthesizer
// Generates 3 distinct, subtle, motivational video game background tracks in real-time.

export type BgmTrackId = 'story' | 'character' | 'model' | 'off';

class GameAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: BgmTrackId = 'off';
  private isMutedState: boolean = false;
  private volumeLevel: number = 0.22; // subtle default volume
  private timerId: number | null = null;
  private currentNoteIndex: number = 0;

  // Initialize Web Audio Context lazily on user gesture
  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMutedState ? 0 : this.volumeLevel, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Frequency conversion helper (MIDI note to Hz)
  private m2h(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Track 1: Story / Portada - "Preludio Espacial AGI"
  // Atmospheric, mysterious, gentle motivational chiptune-pad arpeggios in C Minor
  private playStoryNote(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // 16-step sequence (C Minor / Eb Major)
    // C3, G3, C4, Eb4, G4, Bb4, C5, Eb5 ...
    const melody = [48, 55, 60, 63, 67, 70, 72, 75, 48, 55, 60, 63, 67, 70, 72, 67];
    const bass = [36, 36, 44, 44, 41, 41, 43, 43, 36, 36, 44, 44, 41, 41, 43, 43];

    const note = melody[step % melody.length];
    const bassNote = bass[step % bass.length];

    // Arp Synth
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.m2h(note), time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + 0.25);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);

    // Warm Ambient Sub-Bass every 4 steps
    if (step % 4 === 0) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(this.m2h(bassNote), time);

      bGain.gain.setValueAtTime(0, time);
      bGain.gain.linearRampToValueAtTime(0.12, time + 0.05);
      bGain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      bOsc.connect(bGain);
      bGain.connect(this.masterGain);

      bOsc.start(time);
      bOsc.stop(time + 0.85);
    }
  }

  // Track 2: Mentor / Compañía - "Tema de Reclutamiento & Estrategia"
  // Upbeat, motivational video game melody in Eb / F Minor (105 BPM)
  private playMentorNote(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // 16-step uplifting synth pulse sequence
    const melody = [60, 63, 67, 72, 67, 70, 75, 72, 63, 67, 72, 75, 79, 75, 72, 67];
    const bass = [39, 39, 43, 43, 41, 41, 46, 46, 39, 39, 43, 43, 41, 41, 46, 46];

    const note = melody[step % melody.length];
    const bassNote = bass[step % bass.length];

    // Chiptune Square Wave Pulse
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(this.m2h(note), time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, time);
    filter.frequency.exponentialRampToValueAtTime(600, time + 0.2);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.23);

    // Driving Bass Synth
    if (step % 2 === 0) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'sawtooth';
      bOsc.frequency.setValueAtTime(this.m2h(bassNote), time);

      bGain.gain.setValueAtTime(0, time);
      bGain.gain.linearRampToValueAtTime(0.09, time + 0.02);
      bGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      bOsc.connect(bGain);
      bGain.connect(this.masterGain);

      bOsc.start(time);
      bOsc.stop(time + 0.38);
    }
  }

  // Track 3: Model & Challenge - "Invocación AGI & Misión Principal"
  // Energetic 124 BPM synthwave / 16-bit video game combat & coding track in G Minor
  private playChallengeNote(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // 16-step high-intensity cyber sequence
    const melody = [67, 70, 74, 79, 82, 79, 74, 70, 67, 72, 75, 79, 84, 79, 75, 72];
    const bass = [31, 31, 31, 31, 34, 34, 34, 34, 36, 36, 36, 36, 38, 38, 38, 38];

    const note = melody[step % melody.length];
    const bassNote = bass[step % bass.length];

    // High Energy Lead Synth
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = step % 4 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(this.m2h(note), time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + 0.18);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.07, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.2);

    // 16th Note Driving Synth Bassline
    const bOsc = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    bOsc.type = 'sawtooth';
    bOsc.frequency.setValueAtTime(this.m2h(bassNote), time);

    bGain.gain.setValueAtTime(0, time);
    bGain.gain.linearRampToValueAtTime(0.08, time + 0.01);
    bGain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    bOsc.connect(bGain);
    bGain.connect(this.masterGain);

    bOsc.start(time);
    bOsc.stop(time + 0.18);
  }

  // Audio Sequencer Loop
  private tick = () => {
    if (!this.ctx || this.currentTrack === 'off' || this.isMutedState) {
      return;
    }

    const now = this.ctx.currentTime;

    // Tempo configuration for each track level
    let intervalMs = 280; // ~107 BPM default
    if (this.currentTrack === 'story') {
      intervalMs = 320; // ~93 BPM (calm prelude)
      this.playStoryNote(this.currentNoteIndex, now);
    } else if (this.currentTrack === 'character') {
      intervalMs = 260; // ~115 BPM (upbeat strategic)
      this.playMentorNote(this.currentNoteIndex, now);
    } else if (this.currentTrack === 'model') {
      intervalMs = 200; // ~150 BPM 16th feel (high energy battle)
      this.playChallengeNote(this.currentNoteIndex, now);
    }

    this.currentNoteIndex++;

    this.timerId = window.setTimeout(this.tick, intervalMs);
  };

  // Public Methods
  public setTrack(track: BgmTrackId) {
    this.initContext();
    if (this.currentTrack === track) return;

    this.currentTrack = track;
    this.currentNoteIndex = 0;

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (track !== 'off' && !this.isMutedState) {
      this.tick();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMutedState = !this.isMutedState;

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMutedState ? 0 : this.volumeLevel;
      this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }

    if (!this.isMutedState && this.currentTrack !== 'off' && !this.timerId) {
      this.tick();
    }

    return this.isMutedState;
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public setVolume(val: number) {
    this.volumeLevel = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMutedState) {
      this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public getCurrentTrack(): BgmTrackId {
    return this.currentTrack;
  }
}

export const gameAudioEngine = new GameAudioEngine();

// Play Sound Effect (UI feedback)
export const playSoundEffect = (type: 'hover' | 'click' | 'launch') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'launch') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.35);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio context user gesture block or browser limitation
  }
};
