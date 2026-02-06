
// B"H
/**
 * The Sacred Blueprint of the Spine.
 * The central pillar of the body, the Tree of Life from which all limbs emanate.
 * The foundation is the Pelvis, the root from which the 33 vertebrae ascend to the crown.
 */
export default {
   "name": "spine",
   "description": "Complete vertebral column - 33 vertebrae",
   "bones": [
     {
       "id": "pelvis", "name": "Pelvis", "parent": null,
       "position": [0, 0.85, 0], "size": [0.24, 0.12, 0.1], "type": "pelvis_girdle"
     },
     { "id": "sacrum", "name": "Sacrum", "parent": "pelvis", "position": [0, 0, -0.03], "size": [0.08, 0.1, 0.04], "type": "sacral" },
     { "id": "coccyx", "name": "Coccyx", "parent": "sacrum", "position": [0, -0.08, -0.01], "size": [0.025, 0.04, 0.02], "type": "coccygeal" },
     { "id": "l5", "name": "Lumbar 5", "parent": "sacrum", "position": [0, 0.06, 0.01], "size": [0.07, 0.046, 0.065], "type": "lumbar" },
     { "id": "l4", "name": "Lumbar 4", "parent": "l5", "position": [0, 0.046, 0], "size": [0.068, 0.045, 0.062], "type": "lumbar" },
     { "id": "l3", "name": "Lumbar 3", "parent": "l4", "position": [0, 0.045, 0], "size": [0.065, 0.044, 0.06], "type": "lumbar" },
     { "id": "l2", "name": "Lumbar 2", "parent": "l3", "position": [0, 0.044, 0], "size": [0.062, 0.042, 0.057], "type": "lumbar" },
     { "id": "l1", "name": "Lumbar 1", "parent": "l2", "position": [0, 0.042, 0], "size": [0.06, 0.04, 0.055], "type": "lumbar" },
     { "id": "t12", "name": "Thoracic 12", "parent": "l1", "position": [0, 0.04, 0], "size": [0.056, 0.038, 0.056], "type": "thoracic" },
     { "id": "t11", "name": "Thoracic 11", "parent": "t12", "position": [0, 0.038, 0], "size": [0.054, 0.036, 0.054], "type": "thoracic" },
     { "id": "t10", "name": "Thoracic 10", "parent": "t11", "position": [0, 0.036, 0], "size": [0.052, 0.036, 0.052], "type": "thoracic" },
     { "id": "t9", "name": "Thoracic 9", "parent": "t10", "position": [0, 0.036, 0], "size": [0.051, 0.035, 0.051], "type": "thoracic" },
     { "id": "t8", "name": "Thoracic 8", "parent": "t9", "position": [0, 0.035, 0], "size": [0.05, 0.035, 0.05], "type": "thoracic" },
     { "id": "t7", "name": "Thoracic 7", "parent": "t8", "position": [0, 0.035, 0], "size": [0.049, 0.034, 0.049], "type": "thoracic" },
     { "id": "t6", "name": "Thoracic 6", "parent": "t7", "position": [0, 0.034, 0], "size": [0.048, 0.034, 0.048], "type": "thoracic" },
     { "id": "t5", "name": "Thoracic 5", "parent": "t6", "position": [0, 0.034, 0], "size": [0.047, 0.033, 0.047], "type": "thoracic" },
     { "id": "t4", "name": "Thoracic 4", "parent": "t5", "position": [0, 0.033, 0], "size": [0.046, 0.033, 0.046], "type": "thoracic" },
     { "id": "t3", "name": "Thoracic 3", "parent": "t4", "position": [0, 0.033, 0], "size": [0.045, 0.032, 0.045], "type": "thoracic" },
     { "id": "t2", "name": "Thoracic 2", "parent": "t3", "position": [0, 0.032, 0], "size": [0.044, 0.032, 0.044], "type": "thoracic" },
     { "id": "t1", "name": "Thoracic 1", "parent": "t2", "position": [0, 0.032, 0], "size": [0.042, 0.03, 0.042], "type": "thoracic" },
     { "id": "c7", "name": "Cervical 7", "parent": "t1", "position": [0, 0.03, 0], "size": [0.04, 0.028, 0.04], "type": "cervical" },
     { "id": "c6", "name": "Cervical 6", "parent": "c7", "position": [0, 0.028, 0], "size": [0.037, 0.026, 0.037], "type": "cervical" },
     { "id": "c5", "name": "Cervical 5", "parent": "c6", "position": [0, 0.026, 0], "size": [0.036, 0.026, 0.036], "type": "cervical" },
     { "id": "c4", "name": "Cervical 4", "parent": "c5", "position": [0, 0.026, 0], "size": [0.036, 0.026, 0.036], "type": "cervical" },
     { "id": "c3", "name": "Cervical 3", "parent": "c4", "position": [0, 0.026, 0], "size": [0.036, 0.026, 0.036], "type": "cervical" },
     { "id": "c2_axis", "name": "Axis", "parent": "c3", "position": [0, 0.026, 0], "size": [0.038, 0.028, 0.038], "type": "cervical", "jointType": "pivot" },
     { "id": "c1_atlas", "name": "Atlas", "parent": "c2_axis", "position": [0, 0.028, 0], "size": [0.04, 0.025, 0.04], "type": "cervical", "jointType": "pivot" }
   ]
 }
