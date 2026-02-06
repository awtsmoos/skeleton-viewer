
// B"H
/**
 * New Animation of Projection: Throw.
 * A whip-like cascade of energy, starting from the ground and accelerating through the body,
 * culminating in a final, explosive release from the fingertips.
 */
export default {
  name: "throw",
  duration: 1.2,
  loop: false,
  keyframes: {
    // --- Phase 1: Wind-up (0s - 0.5s) ---
    // Body turns away from target
    "external_oblique_l": [ { "time": 0.0, "activation": 0.1 }, { "time": 0.4, "activation": 0.8 } ],
    "external_oblique_r": [ { "time": 0.0, "activation": 0.8 }, { "time": 0.4, "activation": 0.1 } ],
    // Throwing arm (right) pulls back
    "deltoid_r": [ { "time": 0.0, "activation": 0.1 }, { "time": 0.5, "activation": 0.6 } ],
    "latissimus_dorsi_r": [ { "time": 0.1, "activation": 0.0 }, { "time": 0.5, "activation": 0.5 } ],
    "biceps_brachii_r": [ { "time": 0.2, "activation": 0.1 }, { "time": 0.5, "activation": 0.7 } ], // Cock arm

    // --- Phase 2: Explosion & Release (0.5s - 0.8s) ---
    // Core unwinds violently
    "external_oblique_l": [ { "time": 0.5, "activation": 0.8 }, { "time": 0.7, "activation": 0.1 } ],
    "external_oblique_r": [ { "time": 0.5, "activation": 0.1 }, { "time": 0.7, "activation": 1.0 } ],
    "pectoralis_major_r": [ { "time": 0.5, "activation": 0.2 }, { "time": 0.7, "activation": 1.0 } ], // Chest fires
    "deltoid_r": [ { "time": 0.5, "activation": 0.6 }, { "time": 0.7, "activation": 0.9 } ],
    // Arm whips forward
    "biceps_brachii_r": [ { "time": 0.5, "activation": 0.7 }, { "time": 0.6, "activation": 0.2 } ], // Biceps releases
    "triceps_brachii_r": [ { "time": 0.6, "activation": 0.1 }, { "time": 0.7, "activation": 1.0 } ], // Triceps fires to extend
    "forearm_extensors_r": [ { "time": 0.65, "activation": 0.0 }, { "time": 0.75, "activation": 0.8 } ], // Wrist snap
    
    // --- Phase 3: Follow-through (0.8s - 1.2s) ---
    // Muscles decelerate the arm
    "latissimus_dorsi_r": [ { "time": 0.8, "activation": 0.2 }, { "time": 1.2, "activation": 0.6 } ],
    "biceps_brachii_r": [ { "time": 0.8, "activation": 0.1 }, { "time": 1.2, "activation": 0.5 } ]
  }
}
