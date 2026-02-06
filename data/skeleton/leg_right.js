
// B"H
/**
 * The Sacred Blueprint of the Right Leg.
 * This scroll details the 31 bones of the right lower limb, a perfect mirror of the left,
 * representing the balance of Netzach (Victory/Endurance) and Hod (Splendor/Surrender).
 */
export default {
   "name": "leg_right",
   "description": "Right lower limb - 31 bones (mirror of left leg)",
   "side": "right",
   "bones": [
     { "id": "ilium_r", "name": "Right Ilium", "parent": "sacrum", "position": [0.08, 0.02, 0], "size": [0.08, 0.1, 0.04], "type": "pelvis" },
     { "id": "ischium_r", "name": "Right Ischium", "parent": "ilium_r", "position": [0, -0.08, -0.01], "size": [0.04, 0.05, 0.03], "type": "pelvis" },
     { "id": "pubis_r", "name": "Right Pubis", "parent": "ilium_r", "position": [-0.03, -0.06, 0.03], "size": [0.04, 0.04, 0.02], "type": "pelvis" },
     { "id": "femur_r", "name": "Right Femur", "parent": "ilium_r", "position": [-0.01, -0.1, 0.02], "length": 0.45, "radius": [0.03, 0.025], "type": "long_bone", "jointType": "ball_socket" },
     { "id": "patella_r", "name": "Right Patella", "parent": "femur_r", "position": [0, -0.45, 0.03], "size": [0.04, 0.045, 0.02], "type": "sesamoid" },
     { "id": "tibia_r", "name": "Right Tibia", "parent": "femur_r", "position": [0, -0.45, 0], "length": 0.4, "radius": [0.028, 0.022], "type": "long_bone", "jointType": "hinge" },
     { "id": "fibula_r", "name": "Right Fibula", "parent": "tibia_r", "position": [0.03, 0, 0], "length": 0.38, "radius": 0.01, "type": "long_bone" },
     { "id": "talus_r", "name": "Right Talus", "parent": "tibia_r", "position": [0, -0.4, 0], "size": [0.035, 0.03, 0.05], "type": "tarsal" },
     { "id": "calcaneus_r", "name": "Right Calcaneus", "parent": "talus_r", "position": [0, -0.02, -0.03], "size": [0.035, 0.035, 0.06], "type": "tarsal" },
     { "id": "navicular_r", "name": "Right Navicular", "parent": "talus_r", "position": [-0.01, 0, 0.03], "size": [0.03, 0.015, 0.02], "type": "tarsal" },
     { "id": "cuboid_r", "name": "Right Cuboid", "parent": "calcaneus_r", "position": [0.015, 0.01, 0.03], "size": [0.02, 0.018, 0.025], "type": "tarsal" },
     { "id": "cuneiform_medial_r", "name": "Right Medial Cuneiform", "parent": "navicular_r", "position": [0, 0, 0.02], "size": [0.015, 0.02, 0.02], "type": "tarsal" },
     { "id": "cuneiform_intermediate_r", "name": "Right Intermediate Cuneiform", "parent": "navicular_r", "position": [0.01, 0, 0.018], "size": [0.012, 0.018, 0.018], "type": "tarsal" },
     { "id": "cuneiform_lateral_r", "name": "Right Lateral Cuneiform", "parent": "navicular_r", "position": [0.022, 0, 0.016], "size": [0.015, 0.016, 0.02], "type": "tarsal" },
     { "id": "mt1_r", "name": "Right Metatarsal 1", "parent": "cuneiform_medial_r", "position": [0, 0, 0.02], "length": 0.06, "radius": 0.008, "type": "metatarsal" },
     { "id": "mt2_r", "name": "Right Metatarsal 2", "parent": "cuneiform_intermediate_r", "position": [0, 0, 0.018], "length": 0.07, "radius": 0.005, "type": "metatarsal" },
     { "id": "mt3_r", "name": "Right Metatarsal 3", "parent": "cuneiform_lateral_r", "position": [0, 0, 0.016], "length": 0.065, "radius": 0.005, "type": "metatarsal" },
     { "id": "mt4_r", "name": "Right Metatarsal 4", "parent": "cuboid_r", "position": [0, 0, 0.015], "length": 0.06, "radius": 0.005, "type": "metatarsal" },
     { "id": "mt5_r", "name": "Right Metatarsal 5", "parent": "cuboid_r", "position": [-0.01, 0, 0.01], "length": 0.055, "radius": 0.005, "type": "metatarsal" },
     { "id": "pp1_toe_r", "name": "Right Big Toe Proximal", "parent": "mt1_r", "position": [0, 0, 0.06], "length": 0.03, "radius": 0.006, "type": "phalanx" },
     { "id": "dp1_toe_r", "name": "Right Big Toe Distal", "parent": "pp1_toe_r", "position": [0, 0, 0.03], "length": 0.025, "radius": 0.005, "type": "phalanx" },
     { "id": "pp2_toe_r", "name": "Right 2nd Toe Proximal", "parent": "mt2_r", "position": [0, 0, 0.07], "length": 0.022, "radius": 0.004, "type": "phalanx" },
     { "id": "mp2_toe_r", "name": "Right 2nd Toe Middle", "parent": "pp2_toe_r", "position": [0, 0, 0.022], "length": 0.015, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp2_toe_r", "name": "Right 2nd Toe Distal", "parent": "mp2_toe_r", "position": [0, 0, 0.015], "length": 0.012, "radius": 0.003, "type": "phalanx" },
     { "id": "pp3_toe_r", "name": "Right 3rd Toe Proximal", "parent": "mt3_r", "position": [0, 0, 0.065], "length": 0.02, "radius": 0.004, "type": "phalanx" },
     { "id": "mp3_toe_r", "name": "Right 3rd Toe Middle", "parent": "pp3_toe_r", "position": [0, 0, 0.02], "length": 0.014, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp3_toe_r", "name": "Right 3rd Toe Distal", "parent": "mp3_toe_r", "position": [0, 0, 0.014], "length": 0.011, "radius": 0.003, "type": "phalanx" },
     { "id": "pp4_toe_r", "name": "Right 4th Toe Proximal", "parent": "mt4_r", "position": [0, 0, 0.06], "length": 0.018, "radius": 0.0038, "type": "phalanx" },
     { "id": "mp4_toe_r", "name": "Right 4th Toe Middle", "parent": "pp4_toe_r", "position": [0, 0, 0.018], "length": 0.012, "radius": 0.003, "type": "phalanx" },
     { "id": "dp4_toe_r", "name": "Right 4th Toe Distal", "parent": "mp4_toe_r", "position": [0, 0, 0.012], "length": 0.01, "radius": 0.0025, "type": "phalanx" },
     { "id": "pp5_toe_r", "name": "Right 5th Toe Proximal", "parent": "mt5_r", "position": [0, 0, 0.055], "length": 0.015, "radius": 0.0035, "type": "phalanx" },
     { "id": "mp5_toe_r", "name": "Right 5th Toe Middle", "parent": "pp5_toe_r", "position": [0, 0, 0.015], "length": 0.01, "radius": 0.003, "type": "phalanx" },
     { "id": "dp5_toe_r", "name": "Right 5th Toe Distal", "parent": "mp5_toe_r", "position": [0, 0, 0.01], "length": 0.008, "radius": 0.0025, "type": "phalanx" }
   ]
 }
