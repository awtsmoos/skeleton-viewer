
// B"H
/**
 * The Animation of Greeting: Wave (Muscle-Driven).
 * A gesture of connection, a complex symphony of muscles working in concert.
 * The arm is lifted by the shoulder's will, the hand is turned by the forearm's intent,
 * and the final motion is a pure expression of articulated grace.
 */
export default {
  name: "wave",
  duration: 2.5,
  loop: false,
  keyframes: {
    // --- Phase 1: Lift Arm (0s - 0.5s) ---
    "deltoid_r": [ { "time": 0.0, "activation": 0.0 }, { "time": 0.5, "activation": 0.9 } ],
    "biceps_brachii_r": [ { "time": 0.2, "activation": 0.0 }, { "time": 0.6, "activation": 0.6 } ], // Bend elbow as it rises
    "pectoralis_major_r": [ { "time": 0.1, "activation": 0.0 }, { "time": 0.5, "activation": 0.4 } ], // Assist lift

    // --- Phase 2: Wave Motion (0.5s - 1.8s) ---
    "deltoid_r": [ { "time": 0.5, "activation": 0.9 }, { "time": 1.8, "activation": 0.85 } ], // Hold arm up
    "biceps_brachii_r": [ { "time": 0.6, "activation": 0.6 }, { "time": 1.8, "activation": 0.55 } ], // Hold elbow bent
    "forearm_extensors_r": [
      { "time": 0.5, "activation": 0.0 }, { "time": 0.7, "activation": 0.8 }, { "time": 0.9, "activation": 0.0 },
      { "time": 1.1, "activation": 0.8 }, { "time": 1.3, "activation": 0.0 }
    ],
    "forearm_flexors_r": [
      { "time": 0.7, "activation": 0.0 }, { "time": 0.9, "activation": 0.8 }, { "time": 1.1, "activation": 0.0 },
      { "time": 1.3, "activation": 0.8 }, { "time": 1.5, "activation": 0.0 }
    ],
    
    // --- Phase 3: Lower Arm (1.8s - 2.5s) ---
    "deltoid_r": [ { "time": 1.8, "activation": 0.85 }, { "time": 2.5, "activation": 0.0 } ], // Relax deltoid
    "latissimus_dorsi_r": [ { "time": 1.9, "activation": 0.0 }, { "time": 2.4, "activation": 0.3 } ], // Assist lowering
    "biceps_brachii_r": [ { "time": 1.8, "activation": 0.55 }, { "time": 2.5, "activation": 0.0 } ] // Straighten arm
  },
  blendShapes: {
    "expression": "happy"
  }
}
