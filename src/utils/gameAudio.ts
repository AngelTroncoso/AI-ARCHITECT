// Web Audio API Video Game Soundtrack & Tech-HipHop Synthesizer
// Inspired by Silicon Valley (HBO) Tech-Rap Beats & Retro Chiptunes
// Generates dynamic, punchy, motivational background tracks in real-time.

export type BgmTrackId = 'story' | 'character' | 'model' | 'off';
export type BgmStyle = 'silicon_valley' | 'chiptune';

class GameAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: BgmTrackId = 'off';
  private currentStyle: BgmStyle = 'silicon_valley'; // Silicon Valley Tech-Rap Beat by default!
  private isMutedState: boolean = false;
  private volumeLevel: number = 0.25; // balanced default volume
  private timerId: number | null = null;
  private currentNoteIndex: number = 0;
  private noiseBuffer: AudioBuffer | null = null;

  // Initialize Web Audio Context lazily on user gesture
  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMutedState ? 0 : this.volumeLevel, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create noise buffer for Hi-Hats & Snares
      const bufferSize = this.ctx.sampleRate * 0.5;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Frequency conversion helper (MIDI note to Hz)
  private m2h(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Percussion & Sub-Bass Synthesizers for Underground Silicon Valley Rap Beats
  private play808Kick(time: number, pitch = 130, decay = 0.55) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Deep punchy 808 kick with heavy sub drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.18);

    gain.gain.setValueAtTime(0.38, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + decay + 0.05);
  }

  private playHiHat(time: number, isOpen = false, volume = 0.07) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    const decay = isOpen ? 0.22 : 0.05;

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + decay + 0.01);
  }

  private playSnare(time: number, isGhost = false) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const volumeScale = isGhost ? 0.04 : 0.16;

    // Tonal body (Snare drum wood resonance)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175, time);
    osc.frequency.exponentialRampToValueAtTime(75, time + 0.12);
    oscGain.gain.setValueAtTime(volumeScale, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);

    // Underground Crackle / Snare Wires Noise
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, time);
    filter.Q.setValueAtTime(1.2, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volumeScale * 1.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.24);
  }

  // Deep Underground Bass Chord Stabs (Sub + Minor Chords)
  private playUndergroundBassChord(time: number, midiRoot: number, isMinor = true, duration = 0.6, volume = 0.1) {
    if (!this.ctx || !this.masterGain) return;

    // Chord intervals: Root, Minor/Major 3rd (+3/+4), 5th (+7), Minor 7th (+10)
    const intervals = isMinor ? [0, 3, 7, 10] : [0, 4, 7, 10];

    // 1. Deep Sub-Bass (1 octave below root)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(this.m2h(midiRoot - 12), time);
    subOsc.frequency.exponentialRampToValueAtTime(this.m2h(midiRoot - 12) * 0.98, time + duration);

    subGain.gain.setValueAtTime(0, time);
    subGain.gain.linearRampToValueAtTime(0.24, time + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(time);
    subOsc.stop(time + duration + 0.05);

    // 2. Warm Vinyl Underground Chord Stabs (Triangle + Lowpass Filtered Sawtooth)
    intervals.forEach((interval, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(this.m2h(midiRoot + interval), time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, time);
      filter.frequency.exponentialRampToValueAtTime(220, time + duration);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume / (idx === 0 ? 1 : 1.8), time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
  }

  // ==========================================
  // UNDERGROUND SILICON VALLEY TECH RAP BEATS
  // ==========================================

  // Stage 1: "Preludio Silicon Valley" - Laid-Back Underground Lo-Fi Rap Beat (~86 BPM)
  private playSiliconValleyStory(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Underground Boom-Bap Kick Pattern
    if (step === 0 || step === 7 || step === 10) {
      this.play808Kick(time, 130, 0.6);
    }
    // Heavy Snare / Clap
    if (step === 4 || step === 12) {
      this.playSnare(time);
    } else if (step === 15) {
      this.playSnare(time, true); // Ghost snare
    }
    // Swung Hi-Hats
    this.playHiHat(time, step === 6 || step === 14, step % 2 === 0 ? 0.07 : 0.035);

    // Deep Underground Minor Chord Stabs on beats 0, 4, 8, 12
    if (step === 0) {
      this.playUndergroundBassChord(time, 48, true, 1.2, 0.12); // C minor 7
    } else if (step === 4) {
      this.playUndergroundBassChord(time, 44, true, 1.0, 0.11); // Ab minor 7
    } else if (step === 8) {
      this.playUndergroundBassChord(time, 41, true, 1.2, 0.12); // F minor 7
    } else if (step === 12) {
      this.playUndergroundBassChord(time, 43, false, 1.0, 0.11); // G7 chord
    }

    // Smooth Vinyl Lead Melody (Subtle synth hook)
    const melody = [60, 0, 63, 67, 0, 65, 63, 60, 0, 67, 70, 67, 65, 0, 63, 62];
    const note = melody[step % melody.length];

    if (note > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.m2h(note - 1), time);
      osc.frequency.exponentialRampToValueAtTime(this.m2h(note), time + 0.08); // Slight pitch bend

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + 0.3);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.35);
    }
  }

  // Stage 2: "Pied Piper Cypher" - Deep West Coast Underground Rap Beat (~88 BPM)
  private playSiliconValleyMentor(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Underground West Coast Heavy Kicks
    if (step === 0 || step === 3 || step === 8 || step === 10) {
      this.play808Kick(time, 145, 0.65);
    }
    // Underground Snare
    if (step === 4 || step === 12) {
      this.playSnare(time);
    }
    // Rolling Underground Hi-Hats
    const isHatRoll = step >= 12;
    this.playHiHat(time, step === 6 || step === 14, isHatRoll ? 0.08 : 0.05);

    // Deep Heavy Bass Chords
    if (step === 0) {
      this.playUndergroundBassChord(time, 46, true, 1.1, 0.13); // Bb minor 7
    } else if (step === 6) {
      this.playUndergroundBassChord(time, 43, true, 0.9, 0.12); // G minor 7
    } else if (step === 8) {
      this.playUndergroundBassChord(time, 48, true, 1.1, 0.13); // C minor 7
    } else if (step === 14) {
      this.playUndergroundBassChord(time, 50, true, 0.8, 0.12); // D minor 7
    }

    // Underground Synth Hook
    const riff = [58, 61, 63, 65, 0, 68, 65, 63, 58, 61, 63, 70, 68, 65, 63, 61];
    const currentNote = riff[step % riff.length];

    if (currentNote > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.m2h(currentNote), time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(550, time + 0.25);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.09, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.3);
    }
  }

  // Stage 3: "AGI Raid Boss" - Dark Heavy Underground Trap / Rap Beat (~92 BPM)
  private playSiliconValleyChallenge(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Dark Heavy Sub-Bass 808 Kicks
    if (step === 0 || step === 3 || step === 6 || step === 8 || step === 11 || step === 14) {
      this.play808Kick(time, 150, 0.5);
    }
    // Hard Underground Snare
    if (step === 4 || step === 12) {
      this.playSnare(time);
    }
    this.playHiHat(time, step % 2 === 1, 0.07);

    // Dark Minor 9th Bass Chords
    if (step === 0) {
      this.playUndergroundBassChord(time, 40, true, 1.0, 0.14); // E minor 9
    } else if (step === 8) {
      this.playUndergroundBassChord(time, 43, true, 1.0, 0.14); // G minor 9
    }

    // Aggressive Dark Underground Synth Lead
    const leadSequence = [64, 67, 69, 72, 74, 72, 69, 67, 64, 69, 74, 76, 79, 76, 74, 69];
    const note = leadSequence[step % leadSequence.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(this.m2h(note), time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2100, time);
    filter.frequency.exponentialRampToValueAtTime(700, time + 0.2);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.1, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  // ==========================================
  // RETRO CHIPTUNE BEATS
  // ==========================================

  private playStoryNote(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const melody = [48, 55, 60, 63, 67, 70, 72, 75, 48, 55, 60, 63, 67, 70, 72, 67];
    const note = melody[step % melody.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.m2h(note), time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playMentorNote(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const melody = [60, 63, 67, 72, 67, 70, 75, 72, 63, 67, 72, 75, 79, 75, 72, 67];
    const note = melody[step % melody.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(this.m2h(note), time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.23);
  }

  private playChallengeNote(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const melody = [67, 70, 74, 79, 82, 79, 74, 70, 67, 72, 75, 79, 84, 79, 75, 72];
    const note = melody[step % melody.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = step % 4 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(this.m2h(note), time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.07, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  // Audio Sequencer Loop
  private tick = () => {
    if (!this.ctx || this.currentTrack === 'off' || this.isMutedState) {
      return;
    }

    const now = this.ctx.currentTime;

    let intervalMs = 320;

    if (this.currentStyle === 'silicon_valley') {
      if (this.currentTrack === 'story') {
        intervalMs = 345; // ~87 BPM laid-back underground rap
        this.playSiliconValleyStory(this.currentNoteIndex, now);
      } else if (this.currentTrack === 'character') {
        intervalMs = 330; // ~91 BPM West Coast underground cypher
        this.playSiliconValleyMentor(this.currentNoteIndex, now);
      } else if (this.currentTrack === 'model') {
        intervalMs = 310; // ~96 BPM underground AGI raid beat
        this.playSiliconValleyChallenge(this.currentNoteIndex, now);
      }
    } else {
      if (this.currentTrack === 'story') {
        intervalMs = 320;
        this.playStoryNote(this.currentNoteIndex, now);
      } else if (this.currentTrack === 'character') {
        intervalMs = 260;
        this.playMentorNote(this.currentNoteIndex, now);
      } else if (this.currentTrack === 'model') {
        intervalMs = 200;
        this.playChallengeNote(this.currentNoteIndex, now);
      }
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

  public setStyle(style: BgmStyle) {
    this.currentStyle = style;
    this.currentNoteIndex = 0;
  }

  public getStyle(): BgmStyle {
    return this.currentStyle;
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

