
// B"H
/**
 * The Sacred Blueprint of the Left Arm.
 * This scroll details the 32 bones of the upper limb, an instrument of worldly action and divine service.
 * Each bone emanates from its parent, forming an unbroken chain from the core of the body to the fingertips.
 */
export default {
   "name": "arm_left",
   "description": "Left upper limb - 32 bones (humerus, radius, ulna, 8 carpals, 5 metacarpals, 14 phalanges)",
   "side": "left",
   "bones": [
     {
       "id": "clavicle_l", "name": "Left Clavicle", "parent": "sternum_manubrium",
       "position": [0.08, 0.1, -0.02], "length": 0.15, "radius": [0.012, 0.01],
       "type": "shoulder_girdle", "jointType": "gliding"
     },
     {
       "id": "scapula_l", "name": "Left Scapula", "parent": "rib_4_l",
       "position": [-0.08, 0.0, -0.12], "size": [0.1, 0.14, 0.02],
       "type": "shoulder_girdle"
     },
     {
       "id": "humerus_l", "name": "Left Humerus", "parent": "scapula_l",
       "position": [0, -0.02, 0], "length": 0.3, "radius": [0.022, 0.018],
       "type": "long_bone", "jointType": "ball_socket"
     },
     {
       "id": "radius_l", "name": "Left Radius", "parent": "humerus_l",
       "position": [0.01, -0.3, 0], "length": 0.25, "radius": [0.012, 0.016],
       "type": "long_bone", "jointType": "pivot"
     },
     {
       "id": "ulna_l", "name": "Left Ulna", "parent": "humerus_l",
       "position": [-0.01, -0.3, 0], "length": 0.26, "radius": [0.016, 0.012],
       "type": "long_bone", "jointType": "hinge"
     },
     { "id": "scaphoid_l", "name": "Left Scaphoid", "parent": "radius_l", "position": [0, -0.26, 0], "size": [0.015, 0.012, 0.012], "type": "carpal" },
     { "id": "lunate_l", "name": "Left Lunate", "parent": "radius_l", "position": [0.01, -0.26, 0], "size": [0.012, 0.01, 0.01], "type": "carpal" },
     { "id": "triquetrum_l", "name": "Left Triquetrum", "parent": "ulna_l", "position": [-0.005, -0.27, 0], "size": [0.01, 0.01, 0.01], "type": "carpal" },
     { "id": "pisiform_l", "name": "Left Pisiform", "parent": "triquetrum_l", "position": [0, 0, 0.01], "size": [0.008, 0.008, 0.008], "type": "carpal" },
     { "id": "trapezium_l", "name": "Left Trapezium", "parent": "scaphoid_l", "position": [0, -0.015, 0], "size": [0.012, 0.01, 0.012], "type": "carpal" },
     { "id": "trapezoid_l", "name": "Left Trapezoid", "parent": "scaphoid_l", "position": [0.01, -0.015, 0], "size": [0.01, 0.01, 0.01], "type": "carpal" },
     { "id": "capitate_l", "name": "Left Capitate", "parent": "lunate_l", "position": [0.005, -0.015, 0], "size": [0.012, 0.015, 0.012], "type": "carpal" },
     { "id": "hamate_l", "name": "Left Hamate", "parent": "triquetrum_l", "position": [-0.005, -0.015, 0], "size": [0.012, 0.012, 0.012], "type": "carpal" },
     { "id": "mc1_l", "name": "Left Metacarpal 1", "parent": "trapezium_l", "position": [0, -0.015, 0], "length": 0.04, "radius": 0.006, "type": "metacarpal" },
     { "id": "mc2_l", "name": "Left Metacarpal 2", "parent": "trapezoid_l", "position": [0, -0.015, 0], "length": 0.065, "radius": 0.005, "type": "metacarpal" },
     { "id": "mc3_l", "name": "Left Metacarpal 3", "parent": "capitate_l", "position": [0, -0.015, 0], "length": 0.06, "radius": 0.005, "type": "metacarpal" },
     { "id": "mc4_l", "name": "Left Metacarpal 4", "parent": "hamate_l", "position": [0, -0.015, 0], "length": 0.055, "radius": 0.005, "type": "metacarpal" },
     { "id": "mc5_l", "name": "Left Metacarpal 5", "parent": "hamate_l", "position": [0.005, -0.015, 0], "length": 0.05, "radius": 0.004, "type": "metacarpal" },
     { "id": "pp1_l", "name": "Left Thumb Proximal Phalanx", "parent": "mc1_l", "position": [0, -0.04, 0], "length": 0.03, "radius": 0.005, "type": "phalanx" },
     { "id": "dp1_l", "name": "Left Thumb Distal Phalanx", "parent": "pp1_l", "position": [0, -0.03, 0], "length": 0.022, "radius": 0.004, "type": "phalanx" },
     { "id": "pp2_l", "name": "Left Index Proximal Phalanx", "parent": "mc2_l", "position": [0, -0.065, 0], "length": 0.035, "radius": 0.004, "type": "phalanx" },
     { "id": "mp2_l", "name": "Left Index Middle Phalanx", "parent": "pp2_l", "position": [0, -0.035, 0], "length": 0.025, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp2_l", "name": "Left Index Distal Phalanx", "parent": "mp2_l", "position": [0, -0.025, 0], "length": 0.018, "radius": 0.003, "type": "phalanx" },
     { "id": "pp3_l", "name": "Left Middle Proximal Phalanx", "parent": "mc3_l", "position": [0, -0.06, 0], "length": 0.04, "radius": 0.004, "type": "phalanx" },
     { "id": "mp3_l", "name": "Left Middle Middle Phalanx", "parent": "pp3_l", "position": [0, -0.04, 0], "length": 0.028, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp3_l", "name": "Left Middle Distal Phalanx", "parent": "mp3_l", "position": [0, -0.028, 0], "length": 0.02, "radius": 0.003, "type": "phalanx" },
     { "id": "pp4_l", "name": "Left Ring Proximal Phalanx", "parent": "mc4_l", "position": [0, -0.055, 0], "length": 0.035, "radius": 0.004, "type": "phalanx" },
     { "id": "mp4_l", "name": "Left Ring Middle Phalanx", "parent": "pp4_l", "position": [0, -0.035, 0], "length": 0.025, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp4_l", "name": "Left Ring Distal Phalanx", "parent": "mp4_l", "position": [0, -0.025, 0], "length": 0.018, "radius": 0.003, "type": "phalanx" },
     { "id": "pp5_l", "name": "Left Pinky Proximal Phalanx", "parent": "mc5_l", "position": [0, -0.05, 0], "length": 0.028, "radius": 0.0038, "type": "phalanx" },
     { "id": "mp5_l", "name": "Left Pinky Middle Phalanx", "parent": "pp5_l", "position": [0, -0.028, 0], "length": 0.018, "radius": 0.003, "type": "phalanx" },
     { "id": "dp5_l", "name": "Left Pinky Distal Phalanx", "parent": "mp5_l", "position": [0, -0.018, 0], "length": 0.015, "radius": 0.0025, "type": "phalanx" }
   ]
 }
