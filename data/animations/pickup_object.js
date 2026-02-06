
// B"H
/**
 * New Animation of Acquisition: Pick Up Object.
 * A deliberate sequence of bending, reaching, and grasping. It is an act of will,
 * extending the body's domain to encompass an object from the world.
 */
export default {
  name: "pickup_object",
  duration: 3.0,
  loop: false,
  keyframes: {
    // --- Phase 1: Bend Down (0s - 1.0s) ---
    "erector_spinae": [ { "time": 0.0, "activation": 0.2 }, { "time": 1.0, "activation": 0.8 } ], // Control bend
    "rectus_abdominis": [ { "time": 0.0, "activation": 0.2 }, { "time": 1.0, "activation": 0.6 } ],
    "quadriceps_femoris": [ { "time": 0.2, "activation": 0.1 }, { "time": 1.0, "activation": 0.5 } ], // Bend knees
    "hamstrings": [ { "time": 0.2, "activation": 0.1 }, { "time": 1.0, "activation": 0.4 } ],

    // --- Phase 2: Reach and Grasp (1.0s - 1.8s) ---
    "deltoid_r": [ { "time": 1.0, "activation": 0.1 }, { "time": 1.5, "activation": 0.6 } ], // Reach forward
    "biceps_brachii_r": [ { "time": 1.2, "activation": 0.1 }, { "time": 1.6, "activation": 0.4 } ], // Slight elbow bend
    "forearm_flexors_r": [ { "time": 1.6, "activation": 0.0 }, { "time": 1.8, "activation": 0.7 } ], // Grasp

    // --- Phase 3: Stand Up (1.8s - 3.0s) ---
    "erector_spinae": [ { "time": 1.8, "activation": 0.8 }, { "time": 3.0, "activation": 0.2 } ],
    "gluteus_maximus": [ { "time": 1.8, "activation": 0.1 }, { "time": 2.5, "activation": 0.7 } ], // Power the lift
    "quadriceps_femoris": [ { "time": 1.8, "activation": 0.5 }, { "time": 2.8, "activation": 0.1 } ],
    "biceps_brachii_r": [ { "time": 1.8, "activation": 0.4 }, { "time": 3.0, "activation": 0.3 } ] // Hold object
  }
}
