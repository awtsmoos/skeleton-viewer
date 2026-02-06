// B"H
export const AudioFXGen = {
  createBuffer: (ctx, duration, fn) => {
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = fn(i / sampleRate, i);
    }
    return buffer;
  },

  play: (ctx, dest, type) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    switch (type) {
      case 'laser': // PEW PEW
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'explosion': // BOOM
        // Noise buffer
        const bufferSize = ctx.sampleRate * 1.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(1000, t);
        noiseFilter.frequency.linearRampToValueAtTime(100, t + 0.5);
        noise.connect(noiseFilter);
        noiseFilter.connect(gain);
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        noise.start(t);
        noise.stop(t + 1.0);
        break;

      case 'magic_chime': // SPARKLE
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, t);
        // Arpeggio effect
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1100, t + 0.1);
        osc.frequency.setValueAtTime(1300, t + 0.2);
        osc.frequency.setValueAtTime(1760, t + 0.3);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
        osc.start(t);
        osc.stop(t + 1.5);
        break;

      case 'wind': // AMBIENT
        const windBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const wData = windBuf.getChannelData(0);
        for(let i=0; i<wData.length; i++) wData[i] = Math.random() * 2 - 1;
        const windSrc = ctx.createBufferSource();
        windSrc.buffer = windBuf;
        windSrc.loop = true;
        const wFilter = ctx.createBiquadFilter();
        wFilter.type = 'bandpass';
        wFilter.frequency.setValueAtTime(400, t);
        // Modulate filter for "whooshing"
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(wFilter.frequency);
        lfo.start(t);
        
        windSrc.connect(wFilter);
        wFilter.connect(gain);
        gain.gain.setValueAtTime(0.1, t);
        windSrc.start(t);
        // Don't stop, let it loop (caller should handle stop)
        break;
        
      case 'roar': // MONSTER
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.5);
        // Tremolo
        const roarLfo = ctx.createOscillator();
        roarLfo.frequency.value = 30; // Growl
        const roarLfoGain = ctx.createGain();
        roarLfoGain.gain.value = 500;
        roarLfo.connect(roarLfoGain);
        roarLfoGain.connect(filter.frequency);
        roarLfo.start(t);
        
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        osc.start(t);
        osc.stop(t + 1.0);
        break;
    }
  }
};
