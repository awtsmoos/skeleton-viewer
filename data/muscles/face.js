
// B"H
/**
 * The Muscles of the Divine Countenance.
 * These fine tissues are the instruments of emotion, the physical manifestation of the soul's inner state.
 * They are responsible for every smile, frown, and word spoken.
 */
export default {
  "name": "face_muscles",
  "muscles": [
    // Expression Muscles
    { "id": "frontalis", "action": "raise_eyebrows", "origin": "epicranial_aponeurosis", "insertion": "eyebrow_skin" },
    { "id": "orbicularis_oculi", "action": "close_eye", "origin": "medial_orbital_margin", "insertion": "skin_around_orbit" },
    { "id": "corrugator_supercilii", "action": "frown_eyebrows", "origin": "frontal_bone", "insertion": "eyebrow_skin_medial" },
    { "id": "procerus", "action": "wrinkle_nose_bridge", "origin": "nasal_bone", "insertion": "forehead_skin" },
    { "id": "nasalis", "action": "flare_nostrils", "origin": "maxilla", "insertion": "alar_cartilage" },
    { "id": "levator_labii_superioris", "action": "raise_upper_lip", "origin": "maxilla", "insertion": "upper_lip_skin" },
    { "id": "zygomaticus_major", "action": "smile", "origin": "zygomatic_bone", "insertion": "mouth_corner" },
    { "id": "zygomaticus_minor", "action": "smile_upper", "origin": "zygomatic_bone", "insertion": "upper_lip_skin" },
    { "id": "orbicularis_oris", "action": "pucker_lips", "origin": "maxilla_mandible", "insertion": "skin_around_lips" },
    { "id": "depressor_anguli_oris", "action": "frown_mouth", "origin": "mandible", "insertion": "mouth_corner" },
    { "id": "mentalis", "action": "pout_chin", "origin": "mandible", "insertion": "chin_skin" },
    { "id": "buccinator", "action": "compress_cheek", "origin": "maxilla_mandible", "insertion": "orbicularis_oris" },
    { "id": "risorius", "action": "stretch_lips", "origin": "fascia_over_masseter", "insertion": "mouth_corner" },

    // Mastication Muscles (Chewing)
    { "id": "masseter", "action": "close_jaw", "origin": "zygomatic_arch", "insertion": "mandible_ramus", "flexStrength": 1.0 },
    { "id": "temporalis", "action": "close_jaw_retract", "origin": "temporal_bone", "insertion": "mandible_coronoid", "flexStrength": 0.8 },
    
    // Neck Muscles
    { "id": "sternocleidomastoid", "action": "rotate_head_flex_neck", "origin": "sternum_manubrium", "insertion": "mastoid_process", "flexStrength": 0.9 },
    { "id": "platysma", "action": "tense_neck_skin", "origin": "fascia_over_pec_deltoid", "insertion": "mandible_skin" }
  ]
}
