
// B"H
/**
 * The Animation of Explosive Power: Breakdance Flare.
 * A dynamic, circular motion where the body pivots on the hands while the legs circle,
 * defying gravity. It requires immense core strength and coordination.
 */
export default {
  name: "breakdance_flare",
  duration: 2.0,
  loop: true,
  keyframes: {
    "pelvis": [
      { "time": 0.0, "rotation": [0, 0, 80], "position": [0, 0.2, 0] },
      { "time": 0.5, "rotation": [-45, 90, 0], "position": [0.5, 0.5, 0.5] },
      { "time": 1.0, "rotation": [0, 180, -80], "position": [1.0, 0.2, 0] },
      { "time": 1.5, "rotation": [45, 270, 0], "position": [0.5, 0.5, -0.5] },
      { "time": 2.0, "rotation": [0, 360, 80], "position": [0, 0.2, 0] }
    ],
    // Arms provide the pivot and support
    "humerus_l": [
      { "time": 0.0, "rotation": [-90, -45, 0] }, { "time": 1.0, "rotation": [-90, -45, 0] },
      { "time": 1.1, "rotation": [0, 0, 0] }, { "time": 2.0, "rotation": [-90, -45, 0] }
    ],
    "humerus_r": [
      { "time": 0.0, "rotation": [0, 0, 0] }, { "time": 0.9, "rotation": [0, 0, 0] },
      { "time": 1.0, "rotation": [-90, 45, 0] }, { "time": 2.0, "rotation": [-90, 45, 0] }
    ],
    // Legs perform the circular flare motion
    "femur_l": [
      { "time": 0.0, "rotation": [0, 0, 90] }, { "time": 0.5, "rotation": [-90, 0, 0] },
      { "time": 1.0, "rotation": [0, 0, -90] }, { "time": 1.5, "rotation": [90, 0, 0] },
      { "time": 2.0, "rotation": [0, 0, 90] }
    ],
    "femur_r": [
      { "time": 0.0, "rotation": [90, 0, 0] }, { "time": 0.5, "rotation": [0, 0, 90] },
      { "time": 1.0, "rotation": [-90, 0, 0] }, { "time": 1.5, "rotation": [0, 0, -90] },
      { "time": 2.0, "rotation": [90, 0, 0] }
    ],
     "tibia_l": [
      { "time": 0.0, "rotation": [30, 0, 0] }, { "time": 2.0, "rotation": [30, 0, 0] }
    ],
     "tibia_r": [
      { "time": 0.0, "rotation": [30, 0, 0] }, { "time": 2.0, "rotation": [30, 0, 0] }
    ]
  }
}
