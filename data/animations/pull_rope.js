
// B"H
/**
 * New Animation of Drawing Forth: Pull Rope.
 * A powerful motion of drawing the world closer. It is a testament to the strength
 * of the back and arms, anchored firmly to the earth by the legs.
 */
export default {
  name: "pull_rope",
  duration: 1.5,
  loop: true,
  keyframes: {
    // --- Phase 1: Pull (0s - 0.75s) ---
    "latissimus_dorsi": [ { "time": 0.0, "activation": 0.2 }, { "time": 0.4, "activation": 1.0 }, { "time": 0.75, "activation": 0.4 } ],
    "biceps_brachii": [ { "time": 0.0, "activation": 0.3 }, { "time": 0.5, "activation": 0.9 }, { "time": 0.75, "activation": 0.5 } ],
    "erector_spinae": [ { "time": 0.0, "activation": 0.5 }, { "time": 0.4, "activation": 0.8 } ], // Lean back
    "gluteus_maximus": [ { "time": 0.0, "activation": 0.6 } ], // Anchor
    "hamstrings": [ { "time": 0.0, "activation": 0.7 } ], // Anchor

    // --- Phase 2: Reset (0.75s - 1.5s) ---
    "deltoid": [ { "time": 0.75, "activation": 0.1 }, { "time": 1.2, "activation": 0.6 } ], // Reach forward
    "triceps_brachii": [ { "time": 0.75, "activation": 0.1 }, { "time": 1.2, "activation": 0.5 } ], // Extend arm
    "latissimus_dorsi": [ { "time": 0.75, "activation": 0.4 }, { "time": 1.5, "activation": 0.2 } ],
    "biceps_brachii": [ { "time": 0.75, "activation": 0.5 }, { "time": 1.5, "activation": 0.3 } ],
    "erector_spinae": [ { "time": 0.75, "activation": 0.8 }, { "time": 1.5, "activation": 0.5 } ] // Lean forward
  }
}
