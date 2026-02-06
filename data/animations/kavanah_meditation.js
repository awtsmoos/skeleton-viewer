
// B"H
/**
 * The Animation of Intention: Kavanah Meditation.
 * A state of deep, focused contemplation. The body is still yet alive, aligned with a
 * higher purpose. The breath is slow and deep, and the hands form a conduit for spiritual energy.
 */
export default {
  name: "kavanah_meditation",
  duration: 10.0,
  loop: true,
  keyframes: {
    // Spine is held straight and tall
    "pelvis": [ { "time": 0.0, "rotation": [5, 0, 0] } ],
    "l1": [ { "time": 0.0, "rotation": [-2, 0, 0] } ],
    "t1": [ { "time": 0.0, "rotation": [-2, 0, 0] } ],

    // Deep, slow breathing cycle
    "rib_6_l": [
      { "time": 0.0, "position": [0,0,0] }, { "time": 5.0, "position": [-0.004, 0.005, 0.003] }, { "time": 10.0, "position": [0,0,0] }
    ],
    "rib_6_r": [
      { "time": 0.0, "position": [0,0,0] }, { "time": 5.0, "position": [0.004, 0.005, 0.003] }, { "time": 10.0, "position": [0,0,0] }
    ],

    // Arms held in a meditative pose
    "humerus_l": [ { "time": 0.0, "rotation": [-10, 0, 45] } ],
    "humerus_r": [ { "time": 0.0, "rotation": [-10, 0, -45] } ],
    "radius_l": [ { "time": 0.0, "rotation": [45, -20, 0] } ],
    "radius_r": [ { "time": 0.0, "rotation": [45, 20, 0] } ],

    // Hands form a mudra (thumb and index finger touching)
    "pp1_l": [ { "time": 0.0, "rotation": [45, 0, 0] } ],
    "pp2_l": [ { "time": 0.0, "rotation": [45, 0, 0] } ],
    "pp1_r": [ { "time": 0.0, "rotation": [45, 0, 0] } ],
    "pp2_r": [ { "time": 0.0, "rotation": [45, 0, 0] } ],
    "dp1_l": [ { "time": 0.0, "rotation": [10, 0, 0] } ],
    "dp2_l": [ { "time": 0.0, "rotation": [10, 0, 0] } ],
    "dp1_r": [ { "time": 0.0, "rotation": [10, 0, 0] } ],
    "dp2_r": [ { "time": 0.0, "rotation": [10, 0, 0] } ],
    
    // Head slightly bowed
    "c1_atlas": [ { "time": 0.0, "rotation": [15, 0, 0] } ]
  },
  blendShapes: {
    "blink": { "interval": [8.0, 15.0], "duration": 0.2 },
    "expression": "neutral"
  }
}
