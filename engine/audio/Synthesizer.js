// B"H
import { InstrumentPresets } from './Instruments.js';

export class Synthesizer {
  constructor(ctx, dest) {
    this.ctx = ctx;
    this.dest = dest;
  }

  play(type, frequencyOrNote, duration) {
    const preset = InstrumentPresets[type] || InstrumentPresets['piano'];
    const freq = typeof frequencyOrNote === 'string' 
        ? this.noteToFreq(frequencyOrNote) 
        : frequencyOrNote;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = preset.type; // sine, square, sawtooth, triangle
    osc.frequency.setValueAtTime(freq, t);
    
    // Envelope (ADSR)
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(preset.gain, t + preset.attack);
    gain.gain.exponentialRampToValueAtTime(preset.gain * 0.6, t + preset.attack + preset.decay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration + preset.release);

    // Effects Chain
    let node = osc;
    
    // Distortion
    if (preset.distortion) {
        const dist = this.ctx.createWaveShaper();
        dist.curve = this.makeDistortionCurve(preset.distortion);
        dist.oversample = '4x';
        node.connect(dist);
        node = dist;
    }

    node.connect(gain);
    gain.connect(this.dest);

    osc.start(t);
    osc.stop(t + duration + preset.release + 1.0);
  }

  noteToFreq(note) {
    // Simple lookup or math. Assume 'A4' = 440.
    // For infinite scope, we'd have a full parser.
    // Simplified: Just returning random harmonious freqs for demo if string passed
    // Or basic implementation:
    const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const octave = parseInt(note.slice(-1)) || 4;
    const key = note.slice(0, -1);
    const index = notes.indexOf(key);
    if (index === -1) return 440;
    
    // MIDI math: f = 440 * 2^((d-69)/12)
    // A4 is MIDI 69.
    const semi = index + (octave + 1) * 12;
    return 440 * Math.pow(2, (semi - 69) / 12);
  }

  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180;
    let x;
    for (let i = 0; i < n_samples; ++i) {
      x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}
