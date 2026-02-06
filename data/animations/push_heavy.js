
// B"H
/**
 * New Animation of Exertion: Push Heavy Object.
 * A demonstration of full-body tension and coordinated force. The power flows
 * from the ground, through the legs and core, and is delivered through the arms.
 */
export default {
  name: "push_heavy",
  duration: 4.0,
  loop: true,
  keyframes: {
    // Sustained high tension in major muscle groups
    "quadriceps_femoris": [ { "time": 0.0, "activation": 0.9 } ],
    "gluteus_maximus": [ { "time": 0.0, "activation": 0.85 } ],
    "gastrocnemius": [ { "time": 0.0, "activation": 0.8 } ],
    "erector_spinae": [ { "time": 0.0, "activation": 0.9 } ],
    "rectus_abdominis": [ { "time": 0.0, "activation": 0.8 } ],
    "pectoralis_major": [ { "time": 0.0, "activation": 0.95 } ],
    "deltoid": [ { "time": 0.0, "activation": 0.9 } ],
    "triceps_brachii": [ { "time": 0.0, "activation": 0.9 } ],

    // Shaking / Straining effect with subtle noise
    "biceps_brachii": [
      { "time": 0.0, "activation": 0.7 }, { "time": 0.1, "activation": 0.75 },
      { "time": 0.2, "activation": 0.68 }, { "time": 0.3, "activation": 0.72 }
      // ... this pattern would repeat to simulate tremor
    ],
    // The walk cycle is a slow, powerful push
    "quadriceps_femoris_l": [ { "time": 0.0, "activation": 0.9 }, { "time": 2.0, "activation": 0.7 } ],
    "quadriceps_femoris_r": [ { "time": 0.0, "activation": 0.7 }, { "time": 2.0, "activation": 0.9 } ],
    "gluteus_maximus_l": [ { "time": 0.0, "activation": 0.9 }, { "time": 2.0, "activation": 0.6 } ],
    "gluteus_maximus_r": [ { "time": 0.0, "activation": 0.6 }, { "time": 2.0, "activation": 0.9 } ]
  }
}
