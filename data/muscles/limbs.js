
// B"H
/**
 * The Muscles of Action: The Limbs.
 * These are the engines of worldly interaction, the conduits of will into deed.
 * They are arranged in opposing pairs, the divine balance of flexion and extension.
 */
export default {
  "name": "limb_muscles",
  "muscles": [
    // === ARMS ===
    { "id": "deltoid", "action": "abduct_arm", "origin": ["clavicle_l", "scapula_l"], "insertion": "humerus_l", "flexStrength": 1.0 },
    { "id": "biceps_brachii", "action": "flex_elbow", "origin": "scapula_l", "insertion": "radius_l", "flexStrength": 1.0 },
    { "id": "triceps_brachii", "action": "extend_elbow", "origin": ["scapula_l", "humerus_l"], "insertion": "ulna_l", "flexStrength": 1.0 },
    { "id": "brachialis", "action": "flex_elbow_deep", "origin": "humerus_l", "insertion": "ulna_l", "flexStrength": 0.8 },
    { "id": "brachioradialis", "action": "flex_elbow_forearm", "origin": "humerus_l", "insertion": "radius_l", "flexStrength": 0.7 },
    { "id": "forearm_flexors", "action": "flex_wrist", "origin": "humerus_l", "insertion": "carpals_l", "flexStrength": 0.6 },
    { "id": "forearm_extensors", "action": "extend_wrist", "origin": "humerus_l", "insertion": "carpals_l", "flexStrength": 0.6 },
    
    // === LEGS ===
    { "id": "gluteus_maximus", "action": "extend_hip", "origin": ["ilium_l", "sacrum"], "insertion": "femur_l", "flexStrength": 1.2 },
    { "id": "quadriceps_femoris", "action": "extend_knee", "origin": ["ilium_l", "femur_l"], "insertion": "tibia_l", "flexStrength": 1.5 },
    { "id": "hamstrings", "action": "flex_knee", "origin": "ischium_l", "insertion": ["tibia_l", "fibula_l"], "flexStrength": 1.1 },
    { "id": "gastrocnemius", "action": "plantarflex_ankle", "origin": "femur_l", "insertion": "calcaneus_l", "flexStrength": 1.0 },
    { "id": "tibialis_anterior", "action": "dorsiflex_ankle", "origin": "tibia_l", "insertion": "mt1_l", "flexStrength": 0.7 }
  ]
}
