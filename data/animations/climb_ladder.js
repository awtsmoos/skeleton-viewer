
// B"H
/**
 * New Animation of Ascent: Climb Ladder.
 * A rhythmic, powerful motion of pulling the world down to rise above it.
 * It is a perfect cycle of opposition, with arm and leg working in diagonal pairs.
 */
export default {
  name: "climb_ladder",
  duration: 2.0,
  loop: true,
  keyframes: {
    // --- Left Arm / Right Leg Cycle (0s - 1s) ---
    "latissimus_dorsi_l": [ { "time": 0.0, "activation": 0.9 }, { "time": 0.5, "activation": 0.1 }, { "time": 1.0, "activation": 0.1 } ],
    "biceps_brachii_l": [ { "time": 0.0, "activation": 0.8 }, { "time": 0.5, "activation": 0.2 }, { "time": 1.0, "activation": 0.2 } ],
    "deltoid_l": [ { "time": 0.5, "activation": 0.1 }, { "time": 1.0, "activation": 0.7 } ], // Reach up
    
    "gluteus_maximus_r": [ { "time": 0.0, "activation": 0.9 }, { "time": 0.5, "activation": 0.1 }, { "time": 1.0, "activation": 0.1 } ],
    "quadriceps_femoris_r": [ { "time": 0.0, "activation": 0.8 }, { "time": 0.5, "activation": 0.2 }, { "time": 1.0, "activation": 0.2 } ],
    "hamstrings_r": [ { "time": 0.5, "activation": 0.1 }, { "time": 1.0, "activation": 0.7 } ], // Lift leg

    // --- Right Arm / Left Leg Cycle (1s - 2s) ---
    "latissimus_dorsi_r": [ { "time": 1.0, "activation": 0.9 }, { "time": 1.5, "activation": 0.1 }, { "time": 2.0, "activation": 0.1 } ],
    "biceps_brachii_r": [ { "time": 1.0, "activation": 0.8 }, { "time": 1.5, "activation": 0.2 }, { "time": 2.0, "activation": 0.2 } ],
    "deltoid_r": [ { "time": 0.0, "activation": 0.1 }, { "time": 1.5, "activation": 0.1 }, { "time": 2.0, "activation": 0.7 } ], // Reach up
    
    "gluteus_maximus_l": [ { "time": 1.0, "activation": 0.9 }, { "time": 1.5, "activation": 0.1 }, { "time": 2.0, "activation": 0.1 } ],
    "quadriceps_femoris_l": [ { "time": 1.0, "activation": 0.8 }, { "time": 1.5, "activation": 0.2 }, { "time": 2.0, "activation": 0.2 } ],
    "hamstrings_l": [ { "time": 0.0, "activation": 0.1 }, { "time": 1.5, "activation": 0.1 }, { "time": 2.0, "activation": 0.7 } ] // Lift leg
  }
}
