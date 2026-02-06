
// B"H
/**
 * The Animation of Creation: Divine Gesture.
 * A slow, majestic, and powerful movement, as if shaping the very fabric of reality.
 * It is a motion of pure will and intention, emanating from the core outwards.
 */
export default {
  name: "divine_gesture",
  duration: 8.0,
  loop: false,
  keyframes: {
    // Arms start low and slowly rise, spreading wide
    "humerus_l": [
      { "time": 0.0, "rotation": [0, 0, 5] },
      { "time": 3.0, "rotation": [-45, 30, 20] },
      { "time": 6.0, "rotation": [-90, 0, 90] },
      { "time": 8.0, "rotation": [-90, 0, 90] }
    ],
    "humerus_r": [
      { "time": 0.0, "rotation": [0, 0, -5] },
      { "time": 3.0, "rotation": [-45, -30, -20] },
      { "time": 6.0, "rotation": [-90, 0, -90] },
      { "time": 8.0, "rotation": [-90, 0, -90] }
    ],
    // Forearms extend
    "radius_l": [
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 3.0, "rotation": [20, 0, 0] },
      { "time": 6.0, "rotation": [0, 0, 0] },
      { "time": 8.0, "rotation": [0, 0, 0] }
    ],
    "radius_r": [
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 3.0, "rotation": [20, 0, 0] },
      { "time": 6.0, "rotation": [0, 0, 0] },
      { "time": 8.0, "rotation": [0, 0, 0] }
    ],
    // Hands open gracefully
    "mc3_l": [ // Middle metacarpal to represent hand
      { "time": 0.0, "rotation": [20, 0, 0] }, // Slightly curled
      { "time": 4.0, "rotation": [20, 0, 0] },
      { "time": 7.0, "rotation": [-10, 0, 0] }, // Open palm
      { "time": 8.0, "rotation": [-10, 0, 0] }
    ],
    "mc3_r": [
      { "time": 0.0, "rotation": [20, 0, 0] },
      { "time": 4.0, "rotation": [20, 0, 0] },
      { "time": 7.0, "rotation": [-10, 0, 0] },
      { "time": 8.0, "rotation": [-10, 0, 0] }
    ],
    // Spine straightens with power
    "l1": [
      { "time": 0.0, "rotation": [-5, 0, 0] },
      { "time": 5.0, "rotation": [0, 0, 0] },
      { "time": 8.0, "rotation": [0, 0, 0] }
    ],
    "c1_atlas": [ // Head looks up
      { "time": 0.0, "rotation": [10, 0, 0] },
      { "time": 5.0, "rotation": [-5, 0, 0] },
      { "time": 8.0, "rotation": [-5, 0, 0] }
    ]
  }
}
