
// B"H
/**
 * The Animation of Speech: Talk (Muscle-Driven).
 * The emanation of the inner world through sound, a divine act powered by the fine muscles
 * of the jaw and lips. This describes the rhythmic pull and release that shapes breath into words.
 */
export default {
  name: "talk",
  duration: 0.4,
  loop: true,
  type: "facial",
  keyframes: {
    // Jaw motion driven by mastication muscles. Negative activation implies relaxation allowing jaw to drop.
    "masseter": [
      { "time": 0.0, "activation": 0.0 }, { "time": 0.1, "activation": -0.5 },
      { "time": 0.2, "activation": 0.2 }, { "time": 0.3, "activation": -0.8 },
      { "time": 0.4, "activation": 0.0 }
    ],
    "temporalis": [
      { "time": 0.0, "activation": 0.0 }, { "time": 0.1, "activation": -0.4 },
      { "time": 0.2, "activation": 0.15 }, { "time": 0.3, "activation": -0.6 },
      { "time": 0.4, "activation": 0.0 }
    ],
    // Lip shaping for phonemes
    "orbicularis_oris": [
      { "time": 0.0, "activation": 0 }, { "time": 0.1, "activation": 0.4 },
      { "time": 0.2, "activation": 0.1 }, { "time": 0.3, "activation": 0.6 },
      { "time": 0.4, "activation": 0 }
    ],
    "depressor_anguli_oris": [
      { "time": 0.0, "activation": 0 }, { "time": 0.2, "activation": 0.2 }, { "time": 0.4, "activation": 0 }
    ],
    "zygomaticus_major": [
        { "time": 0.0, "activation": 0.1 }, { "time": 0.2, "activation": 0.15 }, { "time": 0.4, "activation": 0.1 }
    ]
  }
}
