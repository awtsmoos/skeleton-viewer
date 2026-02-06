
// B"H
/**
 * The Sacred Blueprint of the Ribcage.
 * This scroll details the thoracic cage, the protector of the heart and lungs.
 * It consists of 12 pairs of ribs emanating from the thoracic spine, forming a vessel of breath.
 */
export default {
   "name": "ribcage",
   "description": "Thoracic cage - 24 ribs (12 pairs) + sternum",
   "bones": [
     { "id": "sternum_manubrium", "name": "Manubrium", "parent": "t2", "position": [0, 0.04, 0.1], "size": [0.04, 0.05, 0.015], "type": "sternum" },
     { "id": "sternum_body", "name": "Sternal Body", "parent": "sternum_manubrium", "position": [0, -0.07, 0], "size": [0.03, 0.1, 0.012], "type": "sternum" },
     { "id": "sternum_xiphoid", "name": "Xiphoid Process", "parent": "sternum_body", "position": [0, -0.06, 0], "size": [0.012, 0.025, 0.008], "type": "sternum" },
     { "id": "rib_1_l", "name": "Left Rib 1", "parent": "t1", "length": 0.08, "curve": { "x": -0.06, "y": -0.02, "z": 0.05 }, "type": "rib" },
     { "id": "rib_1_r", "name": "Right Rib 1", "parent": "t1", "length": 0.08, "curve": { "x": 0.06, "y": -0.02, "z": 0.05 }, "type": "rib" },
     { "id": "rib_2_l", "name": "Left Rib 2", "parent": "t2", "length": 0.12, "curve": { "x": -0.1, "y": -0.03, "z": 0.06 }, "type": "rib" },
     { "id": "rib_2_r", "name": "Right Rib 2", "parent": "t2", "length": 0.12, "curve": { "x": 0.1, "y": -0.03, "z": 0.06 }, "type": "rib" },
     { "id": "rib_3_l", "name": "Left Rib 3", "parent": "t3", "length": 0.16, "curve": { "x": -0.14, "y": -0.04, "z": 0.07 }, "type": "rib" },
     { "id": "rib_3_r", "name": "Right Rib 3", "parent": "t3", "length": 0.16, "curve": { "x": 0.14, "y": -0.04, "z": 0.07 }, "type": "rib" },
     { "id": "rib_4_l", "name": "Left Rib 4", "parent": "t4", "length": 0.19, "curve": { "x": -0.16, "y": -0.05, "z": 0.08 }, "type": "rib" },
     { "id": "rib_4_r", "name": "Right Rib 4", "parent": "t4", "length": 0.19, "curve": { "x": 0.16, "y": -0.05, "z": 0.08 }, "type": "rib" },
     { "id": "rib_5_l", "name": "Left Rib 5", "parent": "t5", "length": 0.21, "curve": { "x": -0.18, "y": -0.055, "z": 0.09 }, "type": "rib" },
     { "id": "rib_5_r", "name": "Right Rib 5", "parent": "t5", "length": 0.21, "curve": { "x": 0.18, "y": -0.055, "z": 0.09 }, "type": "rib" },
     { "id": "rib_6_l", "name": "Left Rib 6", "parent": "t6", "length": 0.23, "curve": { "x": -0.19, "y": -0.06, "z": 0.1 }, "type": "rib" },
     { "id": "rib_6_r", "name": "Right Rib 6", "parent": "t6", "length": 0.23, "curve": { "x": 0.19, "y": -0.06, "z": 0.1 }, "type": "rib" },
     { "id": "rib_7_l", "name": "Left Rib 7", "parent": "t7", "length": 0.24, "curve": { "x": -0.2, "y": -0.065, "z": 0.1 }, "type": "rib" },
     { "id": "rib_7_r", "name": "Right Rib 7", "parent": "t7", "length": 0.24, "curve": { "x": 0.2, "y": -0.065, "z": 0.1 }, "type": "rib" },
     { "id": "rib_8_l", "name": "Left Rib 8", "parent": "t8", "length": 0.22, "curve": { "x": -0.18, "y": -0.07, "z": 0.09 }, "type": "rib" },
     { "id": "rib_8_r", "name": "Right Rib 8", "parent": "t8", "length": 0.22, "curve": { "x": 0.18, "y": -0.07, "z": 0.09 }, "type": "rib" },
     { "id": "rib_9_l", "name": "Left Rib 9", "parent": "t9", "length": 0.20, "curve": { "x": -0.16, "y": -0.065, "z": 0.08 }, "type": "rib" },
     { "id": "rib_9_r", "name": "Right Rib 9", "parent": "t9", "length": 0.20, "curve": { "x": 0.16, "y": -0.065, "z": 0.08 }, "type": "rib" },
     { "id": "rib_10_l", "name": "Left Rib 10", "parent": "t10", "length": 0.17, "curve": { "x": -0.14, "y": -0.06, "z": 0.07 }, "type": "rib" },
     { "id": "rib_10_r", "name": "Right Rib 10", "parent": "t10", "length": 0.17, "curve": { "x": 0.14, "y": -0.06, "z": 0.07 }, "type": "rib" },
     { "id": "rib_11_l", "name": "Left Rib 11 (Floating)", "parent": "t11", "length": 0.12, "curve": { "x": -0.08, "y": -0.05, "z": 0.06 }, "type": "rib" },
     { "id": "rib_11_r", "name": "Right Rib 11 (Floating)", "parent": "t11", "length": 0.12, "curve": { "x": 0.08, "y": -0.05, "z": 0.06 }, "type": "rib" },
     { "id": "rib_12_l", "name": "Left Rib 12 (Floating)", "parent": "t12", "length": 0.08, "curve": { "x": -0.05, "y": -0.04, "z": 0.05 }, "type": "rib" },
     { "id": "rib_12_r", "name": "Right Rib 12 (Floating)", "parent": "t12", "length": 0.08, "curve": { "x": 0.05, "y": -0.04, "z": 0.05 }, "type": "rib" }
   ]
 }
