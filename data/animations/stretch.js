
// B"H
/**
 * New Animation of Awakening: Stretch.
 * A slow, deliberate extension of the body's major muscle groups.
 * This demonstrates fine control and coordinated tension across the entire form.
 */
export default {
  name: "stretch",
  duration: 6.0,
  loop: false,
  keyframes: {
    // --- Phase 1: Raise Arms (0s - 2s) ---
    "deltoid_l": [ { "time": 0.0, "activation": 0.0 }, { "time": 2.0, "activation": 0.7 } ],
    "deltoid_r": [ { "time": 0.0, "activation": 0.0 }, { "time": 2.0, "activation": 0.7 } ],
    "trapezius": [ { "time": 0.0, "activation": 0.1 }, { "time": 2.0, "activation": 0.5 } ],
    
    // --- Phase 2: Full Body Extension (2s - 4s) ---
    "erector_spinae": [ { "time": 2.0, "activation": 0.3 }, { "time": 3.0, "activation": 0.8 }, { "time": 4.0, "activation": 0.6 } ],
    "triceps_brachii_l": [ { "time": 2.0, "activation": 0.0 }, { "time": 3.5, "activation": 0.6 } ],
    "triceps_brachii_r": [ { "time": 2.0, "activation": 0.0 }, { "time": 3.5, "activation": 0.6 } ],
    "gastrocnemius_l": [ { "time": 2.5, "activation": 0.0 }, { "time": 3.5, "activation": 0.7 } ], // Point toes
    "gastrocnemius_r": [ { "time": 2.5, "activation": 0.0 }, { "time": 3.5, "activation": 0.7 } ],
    
    // Yawn
    "masseter": [ { "time": 2.5, "activation": 0.0 }, { "time": 3.5, "activation": -0.8 }, { "time": 5.0, "activation": 0.0 } ], // Negative activation = relax/open
    "orbicularis_oculi": [ { "time": 3.0, "activation": 0.0 }, { "time": 3.5, "activation": 0.9 }, { "time": 4.5, "activation": 0.0 } ], // Squeeze eyes shut

    // --- Phase 3: Relaxation (4s - 6s) ---
    "deltoid_l": [ { "time": 4.0, "activation": 0.7 }, { "time": 6.0, "activation": 0.0 } ],
    "deltoid_r": [ { "time": 4.0, "activation": 0.7 }, { "time": 6.0, "activation": 0.0 } ],
    "erector_spinae": [ { "time": 4.0, "activation": 0.6 }, { "time": 6.0, "activation": 0.1 } ],
    "triceps_brachii_l": [ { "time": 4.0, "activation": 0.6 }, { "time": 5.5, "activation": 0.0 } ],
    "triceps_brachii_r": [ { "time": 4.0, "activation": 0.6 }, { "time": 5.5, "activation": 0.0 } ],
    "gastrocnemius_l": [ { "time": 4.0, "activation": 0.7 }, { "time": 5.0, "activation": 0.0 } ],
    "gastrocnemius_r": [ { "time": 4.0, "activation": 0.7 }, { "time": 5.0, "activation": 0.0 } ]
  }
}
