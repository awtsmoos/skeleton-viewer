
// B"H
/**
 * New Animation of Transcendence: Jump.
 * An explosive burst of power, defying the earth's pull for a brief, glorious moment.
 * It is the synchronized eruption of the legs' will, channeled through a rigid core.
 */
export default {
  name: "jump",
  duration: 1.5,
  loop: false,
  keyframes: {
    // --- Phase 1: Crouch (0s - 0.4s) ---
    // Antagonistic relaxation to allow crouching
    "quadriceps_femoris": [ { "time": 0.0, "activation": 0.1 }, { "time": 0.4, "activation": 0.3 } ],
    "hamstrings": [ { "time": 0.0, "activation": 0.1 }, { "time": 0.4, "activation": 0.6 } ], // Control descent
    "erector_spinae": [ { "time": 0.0, "activation": 0.2 }, { "time": 0.4, "activation": 0.5 } ], // Lean forward

    // --- Phase 2: EXPLOSION (0.4s - 0.6s) ---
    "gluteus_maximus": [ { "time": 0.4, "activation": 0.2 }, { "time": 0.5, "activation": 1.0 }, { "time": 0.6, "activation": 0.4 } ],
    "quadriceps_femoris": [ { "time": 0.4, "activation": 0.3 }, { "time": 0.5, "activation": 1.0 }, { "time": 0.6, "activation": 0.3 } ],
    "gastrocnemius": [ { "time": 0.45, "activation": 0.1 }, { "time": 0.55, "activation": 1.0 }, { "time": 0.6, "activation": 0.2 } ], // Final push from calves
    "hamstrings": [ { "time": 0.4, "activation": 0.6 }, { "time": 0.5, "activation": 0.1 } ], // Relax to allow extension
    
    // Arm swing for momentum
    "deltoid": [ { "time": 0.3, "activation": 0.1 }, { "time": 0.5, "activation": 0.9 }, { "time": 0.7, "activation": 0.2 } ],
    
    // --- Phase 3: Flight & Landing (0.6s - 1.5s) ---
    // Muscles relax in air, then tense for impact absorption
    "quadriceps_femoris": [ { "time": 1.0, "activation": 0.1 }, { "time": 1.2, "activation": 0.8 } ], // Brace for landing
    "hamstrings": [ { "time": 1.0, "activation": 0.1 }, { "time": 1.2, "activation": 0.7 } ]
  }
}
