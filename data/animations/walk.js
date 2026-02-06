
// B"H
/**
 * The Animation of Purpose: Walk (Muscle-Driven).
 * This new scroll describes walking not as the movement of bones, but as the will of the muscles.
 * It defines the cyclical activation of opposing muscle groups to create a natural, powerful gait.
 */
export default {
  name: "walk",
  duration: 1.0,
  loop: true,
  keyframes: {
    // Left Leg Push-off & Swing
    "gluteus_maximus_l": [
      { "time": 0.0, "activation": 0.8 }, { "time": 0.25, "activation": 0.1 }, 
      { "time": 0.5, "activation": 0.0 }, { "time": 1.0, "activation": 0.8 }
    ],
    "quadriceps_femoris_l": [
      { "time": 0.0, "activation": 0.7 }, { "time": 0.4, "activation": 0.0 },
      { "time": 0.7, "activation": 0.6 }, { "time": 1.0, "activation": 0.7 }
    ],
    "hamstrings_l": [
      { "time": 0.0, "activation": 0.1 }, { "time": 0.5, "activation": 0.8 },
      { "time": 0.8, "activation": 0.2 }, { "time": 1.0, "activation": 0.1 }
    ],
    
    // Right Leg Push-off & Swing (Opposite phase)
    "gluteus_maximus_r": [
      { "time": 0.0, "activation": 0.0 }, { "time": 0.5, "activation": 0.8 },
      { "time": 0.75, "activation": 0.1 }, { "time": 1.0, "activation": 0.0 }
    ],
    "quadriceps_femoris_r": [
      { "time": 0.0, "activation": 0.6 }, { "time": 0.5, "activation": 0.7 },
      { "time": 0.9, "activation": 0.0 }, { "time": 1.0, "activation": 0.6 }
    ],
    "hamstrings_r": [
      { "time": 0.0, "activation": 0.8 }, { "time": 0.3, "activation": 0.2 },
      { "time": 1.0, "activation": 0.8 }
    ],

    // Arm Swing (Opposition)
    "deltoid_l": [
      { "time": 0.0, "activation": 0.4 }, { "time": 0.5, "activation": 0.1 }, { "time": 1.0, "activation": 0.4 }
    ],
     "deltoid_r": [
      { "time": 0.0, "activation": 0.1 }, { "time": 0.5, "activation": 0.4 }, { "time": 1.0, "activation": 0.1 }
    ],

    // Core stabilization
    "erector_spinae": [
      { "time": 0.0, "activation": 0.3 }, { "time": 0.25, "activation": 0.4 },
      { "time": 0.5, "activation": 0.3 }, { "time": 0.75, "activation": 0.4 },
      { "time": 1.0, "activation": 0.3 }
    ]
  }
}
