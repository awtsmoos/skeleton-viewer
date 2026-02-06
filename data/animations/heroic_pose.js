
// B"H
/**
 * The Animation of Power: Heroic Pose.
 * A stance of immense power and readiness, as if a hero has just landed or is powering up.
 * The body is tensed, the center of gravity low, emanating strength.
 */
export default {
  name: "heroic_pose",
  duration: 5.0,
  loop: false,
  keyframes: {
    // Low center of gravity, wide stance
    "pelvis": [ { "time": 0.0, "position": [0, -0.1, 0], "rotation": [10, 0, 0] } ],
    "femur_l": [ { "time": 0.0, "rotation": [0, 0, -25] } ],
    "femur_r": [ { "time": 0.0, "rotation": [0, 0, 25] } ],
    "tibia_l": [ { "time": 0.0, "rotation": [30, 0, 0] } ],
    "tibia_r": [ { "time": 0.0, "rotation": [30, 0, 0] } ],
    
    // Torso is upright and tensed
    "l1": [ { "time": 0.0, "rotation": [-10, 0, 0] } ],
    "t1": [ { "time": 0.0, "rotation": [-5, 0, 0] } ],

    // Arms are clenched and ready
    "humerus_l": [ { "time": 0.0, "rotation": [-30, -20, 80] } ],
    "humerus_r": [ { "time": 0.0, "rotation": [-30, 20, -80] } ],
    "radius_l": [ { "time": 0.0, "rotation": [90, 0, 0] } ],
    "radius_r": [ { "time": 0.0, "rotation": [90, 0, 0] } ],

    // Hands are clenched into fists (approximated by curling metacarpals)
    "mc1_l": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc2_l": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc3_l": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc4_l": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc5_l": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc1_r": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc2_r": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc3_r": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc4_r": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    "mc5_r": [ { "time": 0.0, "rotation": [80, 0, 0] } ],
    
    // Head looks forward with intensity
    "c1_atlas": [ { "time": 0.0, "rotation": [0, 0, 0] } ]
  },
  blendShapes: {
    "expression": "angry"
  }
}
