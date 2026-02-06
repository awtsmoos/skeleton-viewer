// B"H
/**
 * The Sacred Blueprint of the Skull.
 * Aligned to a Shared Center, but with distinct identities for plate visualization.
 */
export default {
   "name": "skull",
   "bones": [
     // --- THE CRANIAL CORE ---
     { "id": "sphenoid", "name": "Sphenoid", "parent": "c1_atlas", "position": [0, 0.05, 0], "size": [0.05, 0.05, 0.05], "type": "cranial_base" },
     
     // --- THE VAULT (Shared Center [0,0,0] relative to Sphenoid) ---
     { "id": "occipital", "name": "Occipital Plate", "parent": "sphenoid", "position": [0, 0, 0], "type": "cranial" },
     { "id": "parietal_l", "name": "Parietal Plate L", "parent": "sphenoid", "position": [0, 0, 0], "type": "cranial" },
     { "id": "parietal_r", "name": "Parietal Plate R", "parent": "sphenoid", "position": [0, 0, 0], "type": "cranial" },
     { "id": "temporal_l", "name": "Temporal Plate L", "parent": "sphenoid", "position": [0, 0, 0], "type": "cranial" },
     { "id": "temporal_r", "name": "Temporal Plate R", "parent": "sphenoid", "position": [0, 0, 0], "type": "cranial" },
     { "id": "frontal", "name": "Frontal Plate (The Mask)", "parent": "sphenoid", "position": [0, 0, 0], "type": "cranial" },
     
     // --- THE FACIAL STRUCTURE ---
     { "id": "maxilla_l", "name": "Maxilla L", "parent": "sphenoid", "position": [-0.025, -0.06, 0.065], "size": [0.04, 0.05, 0.04], "type": "facial" },
     { "id": "maxilla_r", "name": "Maxilla R", "parent": "sphenoid", "position": [0.025, -0.06, 0.065], "size": [0.04, 0.05, 0.04], "type": "facial" },
     { "id": "zygomatic_l", "name": "Zygomatic L", "parent": "maxilla_l", "position": [-0.04, 0.03, -0.01], "size": [0.03, 0.03, 0.02], "type": "facial" },
     { "id": "zygomatic_r", "name": "Zygomatic R", "parent": "maxilla_r", "position": [0.04, 0.03, -0.01], "size": [0.03, 0.03, 0.02], "type": "facial" },
     
     { "id": "mandible", "name": "Mandible", "parent": "sphenoid", "position": [0, -0.08, 0.03], "size": [0.12, 0.08, 0.1], "type": "facial", "jointType": "hinge" }
   ]
}
