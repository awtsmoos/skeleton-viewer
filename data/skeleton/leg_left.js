
// B"H
/**
 * The Sacred Blueprint of the Left Leg.
 * This scroll details the 31 bones of the lower limb, the foundation upon which the vessel stands.
 * The emanation begins at the sacrum and flows downward to the earth.
 */
export default {
   "name": "leg_left",
   "description": "Left lower limb - 31 bones (pelvis contribution, femur, patella, tibia, fibula, 7 tarsals, 5 metatarsals, 14 phalanges)",
   "side": "left",
   "bones": [
     {
       "id": "ilium_l", "name": "Left Ilium", "parent": "sacrum",
       "position": [-0.08, 0.02, 0], "size": [0.08, 0.1, 0.04], "type": "pelvis"
     },
     {
       "id": "ischium_l", "name": "Left Ischium", "parent": "ilium_l",
       "position": [0, -0.08, -0.01], "size": [0.04, 0.05, 0.03], "type": "pelvis"
     },
     {
       "id": "pubis_l", "name": "Left Pubis", "parent": "ilium_l",
       "position": [0.03, -0.06, 0.03], "size": [0.04, 0.04, 0.02], "type": "pelvis"
     },
     {
       "id": "femur_l", "name": "Left Femur", "parent": "ilium_l",
       "position": [0.01, -0.1, 0.02], "length": 0.45, "radius": [0.03, 0.025],
       "type": "long_bone", "jointType": "ball_socket"
     },
     {
       "id": "patella_l", "name": "Left Patella", "parent": "femur_l",
       "position": [0, -0.45, 0.03], "size": [0.04, 0.045, 0.02], "type": "sesamoid"
     },
     {
       "id": "tibia_l", "name": "Left Tibia", "parent": "femur_l",
       "position": [0, -0.45, 0], "length": 0.4, "radius": [0.028, 0.022],
       "type": "long_bone", "jointType": "hinge"
     },
     {
       "id": "fibula_l", "name": "Left Fibula", "parent": "tibia_l",
       "position": [-0.03, 0, 0], "length": 0.38, "radius": 0.01, "type": "long_bone"
     },
     { "id": "talus_l", "name": "Left Talus", "parent": "tibia_l", "position": [0, -0.4, 0], "size": [0.035, 0.03, 0.05], "type": "tarsal" },
     { "id": "calcaneus_l", "name": "Left Calcaneus", "parent": "talus_l", "position": [0, -0.02, -0.03], "size": [0.035, 0.035, 0.06], "type": "tarsal" },
     { "id": "navicular_l", "name": "Left Navicular", "parent": "talus_l", "position": [0.01, 0, 0.03], "size": [0.03, 0.015, 0.02], "type": "tarsal" },
     { "id": "cuboid_l", "name": "Left Cuboid", "parent": "calcaneus_l", "position": [-0.015, 0.01, 0.03], "size": [0.02, 0.018, 0.025], "type": "tarsal" },
     { "id": "cuneiform_medial_l", "name": "Left Medial Cuneiform", "parent": "navicular_l", "position": [0, 0, 0.02], "size": [0.015, 0.02, 0.02], "type": "tarsal" },
     { "id": "cuneiform_intermediate_l", "name": "Left Intermediate Cuneiform", "parent": "navicular_l", "position": [-0.01, 0, 0.018], "size": [0.012, 0.018, 0.018], "type": "tarsal" },
     { "id": "cuneiform_lateral_l", "name": "Left Lateral Cuneiform", "parent": "navicular_l", "position": [-0.022, 0, 0.016], "size": [0.015, 0.016, 0.02], "type": "tarsal" },
     { "id": "mt1_l", "name": "Left Metatarsal 1", "parent": "cuneiform_medial_l", "position": [0, 0, 0.02], "length": 0.06, "radius": 0.008, "type": "metatarsal" },
     { "id": "mt2_l", "name": "Left Metatarsal 2", "parent": "cuneiform_intermediate_l", "position": [0, 0, 0.018], "length": 0.07, "radius": 0.005, "type": "metatarsal" },
     { "id": "mt3_l", "name": "Left Metatarsal 3", "parent": "cuneiform_lateral_l", "position": [0, 0, 0.016], "length": 0.065, "radius": 0.005, "type": "metatarsal" },
     { "id": "mt4_l", "name": "Left Metatarsal 4", "parent": "cuboid_l", "position": [0, 0, 0.015], "length": 0.06, "radius": 0.005, "type": "metatarsal" },
     { "id": "mt5_l", "name": "Left Metatarsal 5", "parent": "cuboid_l", "position": [0.01, 0, 0.01], "length": 0.055, "radius": 0.005, "type": "metatarsal" },
     { "id": "pp1_toe_l", "name": "Left Big Toe Proximal", "parent": "mt1_l", "position": [0, 0, 0.06], "length": 0.03, "radius": 0.006, "type": "phalanx" },
     { "id": "dp1_toe_l", "name": "Left Big Toe Distal", "parent": "pp1_toe_l", "position": [0, 0, 0.03], "length": 0.025, "radius": 0.005, "type": "phalanx" },
     { "id": "pp2_toe_l", "name": "Left 2nd Toe Proximal", "parent": "mt2_l", "position": [0, 0, 0.07], "length": 0.022, "radius": 0.004, "type": "phalanx" },
     { "id": "mp2_toe_l", "name": "Left 2nd Toe Middle", "parent": "pp2_toe_l", "position": [0, 0, 0.022], "length": 0.015, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp2_toe_l", "name": "Left 2nd Toe Distal", "parent": "mp2_toe_l", "position": [0, 0, 0.015], "length": 0.012, "radius": 0.003, "type": "phalanx" },
     { "id": "pp3_toe_l", "name": "Left 3rd Toe Proximal", "parent": "mt3_l", "position": [0, 0, 0.065], "length": 0.02, "radius": 0.004, "type": "phalanx" },
     { "id": "mp3_toe_l", "name": "Left 3rd Toe Middle", "parent": "pp3_toe_l", "position": [0, 0, 0.02], "length": 0.014, "radius": 0.0035, "type": "phalanx" },
     { "id": "dp3_toe_l", "name": "Left 3rd Toe Distal", "parent": "mp3_toe_l", "position": [0, 0, 0.014], "length": 0.011, "radius": 0.003, "type": "phalanx" },
     { "id": "pp4_toe_l", "name": "Left 4th Toe Proximal", "parent": "mt4_l", "position": [0, 0, 0.06], "length": 0.018, "radius": 0.0038, "type": "phalanx" },
     { "id": "mp4_toe_l", "name": "Left 4th Toe Middle", "parent": "pp4_toe_l", "position": [0, 0, 0.018], "length": 0.012, "radius": 0.003, "type": "phalanx" },
     { "id": "dp4_toe_l", "name": "Left 4th Toe Distal", "parent": "mp4_toe_l", "position": [0, 0, 0.012], "length": 0.01, "radius": 0.0025, "type": "phalanx" },
     { "id": "pp5_toe_l", "name": "Left 5th Toe Proximal", "parent": "mt5_l", "position": [0, 0, 0.055], "length": 0.015, "radius": 0.0035, "type": "phalanx" },
     { "id": "mp5_toe_l", "name": "Left 5th Toe Middle", "parent": "pp5_toe_l", "position": [0, 0, 0.015], "length": 0.01, "radius": 0.003, "type": "phalanx" },
     { "id": "dp5_toe_l", "name": "Left 5th Toe Distal", "parent": "mp5_toe_l", "position": [0, 0, 0.01], "length": 0.008, "radius": 0.0025, "type": "phalanx" }
   ]
 }
