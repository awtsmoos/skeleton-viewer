
// B"H
/**
 * New Animation of Intellect: Typing.
 * A subtle, rapid dance of the fingers, driven by the fine muscles of the forearm.
 * It is the translation of thought into digital form, a quiet but intense act of creation.
 */
export default {
  name: "typing",
  duration: 0.2,
  loop: true,
  keyframes: {
    // Rapid, low-amplitude, alternating activation of forearm muscles
    "forearm_flexors_l": [
      { "time": 0.0, "activation": 0.3 }, { "time": 0.05, "activation": 0.1 },
      { "time": 0.1, "activation": 0.25 }, { "time": 0.15, "activation": 0.15 }
    ],
    "forearm_extensors_l": [
      { "time": 0.0, "activation": 0.1 }, { "time": 0.05, "activation": 0.28 },
      { "time": 0.1, "activation": 0.12 }, { "time": 0.15, "activation": 0.3 }
    ],
    "forearm_flexors_r": [
      { "time": 0.02, "activation": 0.28 }, { "time": 0.07, "activation": 0.12 },
      { "time": 0.12, "activation": 0.3 }, { "time": 0.17, "activation": 0.1 }
    ],
    "forearm_extensors_r": [
      { "time": 0.02, "activation": 0.15 }, { "time": 0.07, "activation": 0.25 },
      { "time": 0.12, "activation": 0.1 }, { "time": 0.17, "activation": 0.28 }
    ],
    // Hold arms in position
    "biceps_brachii": [ { "time": 0.0, "activation": 0.2 } ],
    "triceps_brachii": [ { "time": 0.0, "activation": 0.15 } ],
    "deltoid": [ { "time": 0.0, "activation": 0.25 } ]
  }
}
