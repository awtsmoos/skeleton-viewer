// B"H
import { Synthesizer } from './Synthesizer.js';

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.instruments = new Map();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
    console.log("Audio Engine Ignited.");
  }

  playNote(instrumentType, note, duration = 0.5) {
    if (!this.initialized) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Create synth instance on the fly for polyphony
    const synth = new Synthesizer(this.ctx, this.masterGain);
    synth.play(instrumentType, note, duration);
  }
}

export const GlobalAudio = new AudioEngine();
