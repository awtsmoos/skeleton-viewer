
// B"H
/**
 * The Muscles of the Core: The Torso.
 * The pillar of strength and the vessel of breath. These muscles stabilize the spine,
 * protect the inner organs, and power the very act of breathing.
 */
export default {
  "name": "torso_muscles",
  "muscles": [
    { "id": "pectoralis_major", "action": "adduct_arm_horizontal", "origin": ["clavicle_l", "sternum_body"], "insertion": "humerus_l", "flexStrength": 1.0 },
    { "id": "rectus_abdominis", "action": "flex_spine", "origin": "pubis_l", "insertion": "sternum_xiphoid", "flexStrength": 0.8 },
    { "id": "external_oblique", "action": "rotate_spine", "origin": "rib_5_l", "insertion": "ilium_l", "flexStrength": 0.7 },
    { "id": "serratus_anterior", "action": "protract_scapula", "origin": "rib_1_l", "insertion": "scapula_l", "flexStrength": 0.6 },
    { "id": "latissimus_dorsi", "action": "extend_adduct_arm", "origin": "t7", "insertion": "humerus_l", "flexStrength": 1.2 },
    { "id": "trapezius", "action": "elevate_scapula", "origin": "c1_atlas", "insertion": "scapula_l", "flexStrength": 0.9 },
    { "id": "erector_spinae", "action": "extend_spine", "origin": "sacrum", "insertion": "c1_atlas", "flexStrength": 1.1 }
  ]
}
