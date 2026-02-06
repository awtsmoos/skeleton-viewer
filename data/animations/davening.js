
// B"H
/**
 * The Animation of Devotion: Davening.
 * The rhythmic swaying of the body in prayer, known as shuckling.
 * It is a physical manifestation of the soul's passionate ascent.
 */
export default {
  name: "davening",
  duration: 2.5,
  loop: true,
  keyframes: {
    // The core motion comes from the lower back and pelvis
    "l5": [
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 1.25, "rotation": [-20, 0, 0] },
      { "time": 2.5, "rotation": [0, 0, 0] }
    ],
    "l1": [
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 1.25, "rotation": [-15, 0, 0] },
      { "time": 2.5, "rotation": [0, 0, 0] }
    ],
    "t7": [ // Mid-torso follows
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 1.25, "rotation": [-10, 0, 0] },
      { "time": 2.5, "rotation": [0, 0, 0] }
    ],
    "c1_atlas": [ // Head nods slightly
      { "time": 0.0, "rotation": [5, 0, 0] },
      { "time": 0.6, "rotation": [15, 0, 0] },
      { "time": 1.25, "rotation": [2, 0, 0] },
      { "time": 1.9, "rotation": [15, 0, 0] },
      { "time": 2.5, "rotation": [5, 0, 0] }
    ],
    // Knees have a slight bend
    "tibia_l": [
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 1.25, "rotation": [10, 0, 0] },
      { "time": 2.5, "rotation": [0, 0, 0] }
    ],
    "tibia_r": [
      { "time": 0.0, "rotation": [0, 0, 0] },
      { "time": 1.25, "rotation": [10, 0, 0] },
      { "time": 2.5, "rotation": [0, 0, 0] }
    ]
  }
}
