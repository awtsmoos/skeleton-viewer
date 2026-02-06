// B"H
export const InstrumentPresets = {
    piano: {
        type: 'triangle',
        gain: 0.5,
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.5,
        distortion: 0
    },
    guitar: {
        type: 'sawtooth',
        gain: 0.4,
        attack: 0.05,
        decay: 0.1,
        sustain: 0.5,
        release: 1.0,
        distortion: 400 // Heavy metal
    },
    synth: {
        type: 'square',
        gain: 0.3,
        attack: 0.1,
        decay: 0.1,
        sustain: 0.8,
        release: 0.2,
        distortion: 0
    },
    flute: {
        type: 'sine',
        gain: 0.6,
        attack: 0.1,
        decay: 0.1,
        sustain: 0.9,
        release: 0.3,
        distortion: 0
    },
    kick: { // Synthetic drum
        type: 'sine',
        gain: 1.0,
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
        freqMultiplier: 0.1 // Pitch drop logic handled in synth ideally
    }
};
