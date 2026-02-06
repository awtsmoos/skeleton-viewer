
// B"H
/**
 * The Sacred Blueprint of the Right Arm.
 * This scroll details the 32 bones of the right upper limb, a perfect mirror of the left,
 * representing the balance of Gevurah (Strength/Severity) and Chesed (Kindness/Grace).
 */
export default {
   "name": "arm_right",
   "description": "Right upper limb - 32 bones (mirror of left arm)",
   "side": "right",
   "bones": [
     {
       "id": "clavicle_r", "name": "Right Clavicle", "parent": "sternum_manubrium",
       "position": [-0.08, 0.1, -0.02], "length": 0.15, "radius": [0.012, 0.01],
       "type": "shoulder_girdle", "jointType": "gliding"
     },
     {
       "id": "scapula_r", "name": "Right Scapula", "parent": "rib_4_r",
       "position": [0.08, 0.0, -0.12], "size": [0.1, 0.14, 0.02],
       "type": "shoulder_girdle"
     },
     {
       "id": "humerus_r", "name": "Right Humerus", "parent": "scapula_r",
       "position": [0, -0.02, 0], "length": 0.3, "radius": [0.022, 0.018],
       "type": "long_bone", "jointType": "ball_socket"
     },
     {
       "id": "radius_r", "name": "Right Radius", "parent": "humerus_r",
       "position": [-0.01, -0.3, 0], "length": 0.25, "radius": [0.012, 0.016],
       "type": "long_bone", "jointType": "pivot"
     },
     {
       "id": "ulna_r", "name": "Right Ulna", "parent": "humerus_r",
       "position": [0.01, -0.3, 0], "length": 0.26, "radius": [0.016, 0.012],
       "type": "long_bone", "jointType": "hinge"
     },
     { "id": "scaphoid_r", "name": "Right Scaphoid", "parent": "radius_r", "position": [0, -0.26, 0], "size": [0.015, 0.012, 0.012], "type": "carpal" },
     { "id": "lunate_r", "name": "Right Lunate", "parent": "radius_r", "position": [-0.01, -0.26, 0], "size": [0.012, 0.01, 0.01], "type": "carpal" },
     { "id": "triquetrum_r", "name": "Right Triquetrum", "parent": "ulna_r", "position": [0.005, -0.27, 0], "size": [0.01, 0.01, 0.01], "type": "carpal" },
     { "id": "pisiform_r", "name": "Right Pisiform", "parent": "triquetrum_r", "position": [0, 0, 0.01], "size": [0.008, 0.008, 0.008], "type": "carpal" },
     { "id": "trapezium_r", "name": "Right Trapezium", "parent": "scaphoid_r", "position": [0, -0.015, 0], "size": [0.012, 0.01, 0.012], "type": "carpal" },
     { "id": "trapezoid_r", "name": "Right Trapezoid", "parent": "scaphoid_r", "position": [-0.01, -0.015, 0], "size": [0.01, 0.01, 0.01], "type": "carpal" },
     { "id": "capitate_r", "name": "Right Capitate", "parent": "lunate_r", "position": [-0.005, -0.015, 0], "size": [0.012, 0.015, 0.012], "type": "carpal" },
     { "id": "hamate_r", "name": "Right Hamate", "parent": "triquetrum_r", "position": [0.005, -0.015, 0], "size": [0.012, 0.012, 0.012], "type": "carpal" },
     { "id": "mc1_r", "name": "Right Metacarpal 1", "parent": "trapezium_r", "position": [0, -0.015, 0], "length": 0.04, "radius": 0.006, "type": "metacarpal" },
     { "id": "mc2_r", "name": "Right Metacarpal 2", "parent": "trapezoid_r", "position": [0, -0.015, 0], "length": 0.065, "radius": 0.005, "type": "metacarpal" },
     { "id": "mc3_r", "name": "Right Metacarpal 3", "parent": "capitate_r", "position": [0, -0.015, 0], "length": 0.06, "radius": 0.005, "type": "metacarpal" },
     { "id": "mc4_r", "name": "Right Metacarpal 4", "parent": "hamate_r", "position": [0, -0.015, 0], "length": 0.055, "radius": 0.005, "type": "metacarpal" },
     { "id": "mc5_r", "name": "Right Metacarpal 5", "parent": "hamate_r", "position": [-0.005, -0.015, 0], "length": 0.05, "radius": 0.004, "type": "metacarpal" },
     { "id": "pp1_r", "name": "Right Thumb Proximal", "parent": "mc1_r", "position": [0, -0.04, 0], "length": 0.03, "radius": 0.005, "type": "phalanx" },
     { "id": "dp1_r", "name": "Right Thumb Distal", "parent": "pp1_r", "position": [0, -0.03, 0], "length": 0.022, "radius": 0.004, "type": "phalanx" },
     { "id": "pp2_r", "name": "Right Index Proximal", "parent": "mc2_r", "position": [0, -0.065, 0], "length": 0.035, "radius": 0.004, "type": "phalanx" },
     { "id": "mp2_r", "name": "Right Index Middle", "parent": "pp2_r", "position": [0, -0.035, 0], "length": 0.025, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp2_r", "name": "Right Index Distal", "parent": "mp2_r", "position": [0, -0.025, 0], "length": 0.018, "radius": 0.003, "type": "phalanx" },
     { "id": "pp3_r", "name": "Right Middle Proximal", "parent": "mc3_r", "position": [0, -0.06, 0], "length": 0.04, "radius": 0.004, "type": "phalanx" },
     { "id": "mp3_r", "name": "Right Middle Middle", "parent": "pp3_r", "position": [0, -0.04, 0], "length": 0.028, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp3_r", "name": "Right Middle Distal", "parent": "mp3_r", "position": [0, -0.028, 0], "length": 0.02, "radius": 0.003, "type": "phalanx" },
     { "id": "pp4_r", "name": "Right Ring Proximal", "parent": "mc4_r", "position": [0, -0.055, 0], "length": 0.035, "radius": 0.004, "type": "phalanx" },
     { "id": "mp4_r", "name": "Right Ring Middle", "parent": "pp4_r", "position": [0, -0.035, 0], "length": 0.025, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp4_r", "name": "Right Ring Distal", "parent": "mp4_r", "position": [0, -0.025, 0], "length": 0.018, "radius": 0.003, "type": "phalanx" },
     { "id": "pp5_r", "name": "Right Pinky Proximal", "parent": "mc5_r", "position": [0, -0.05, 0], "length": 0.028, "radius": 0.0038, "type": "phalanx" },
     { "id": "mp5_r", "name": "Right Pinky Middle", "parent": "pp5_r", "position": [0, -0.028, 0], "length": 0.018, "radius": 0.003, "type": "phalanx" },
     { "id": "dp5_r", "name": "Right Pinky Distal", "parent": "mp5_r", "position": [0, -0.018, 0], "length": 0.015, "radius": 0.0025, "type": "phalanx" }
   ]
 }
