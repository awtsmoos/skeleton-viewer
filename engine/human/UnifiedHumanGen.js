// B"H
/**
 * UnifiedHumanGen: The Complete Divine Human
 * Creates ONE continuous mesh for the entire human body
 * Combines body, face, limbs, and hair into a seamless form
 */
import { LoftEngine } from '../geometry/LoftEngine.js';
import { BodyMeshGen } from './mesh/BodyMeshGen.js';
import { FaceMeshGen } from './mesh/FaceMeshGen.js';
import { LimbMeshGen } from './mesh/LimbMeshGen.js';
import { HairMeshGen } from './mesh/HairMeshGen.js';
import { DNASystem } from './DNASystem.js';

export const UnifiedHumanGen = {
    /**
     * Generate complete human with all parts
     * @param {Object} dna - Optional DNA parameters
     * @returns {Object} Complete human geometry data
     */
    generate: (dna = null) => {
        // Generate or use provided DNA
        const humanDNA = dna || DNASystem.generateRandom();
        
        // Generate core body mesh
        const bodyGeo = BodyMeshGen.generate(humanDNA);
        
        // Generate limbs
        const leftArm = LimbMeshGen.generateArm('left', humanDNA);
        const rightArm = LimbMeshGen.generateArm('right', humanDNA);
        const leftLeg = LimbMeshGen.generateLeg('left', humanDNA);
        const rightLeg = LimbMeshGen.generateLeg('right', humanDNA);
        
        // Weld body and limbs into ONE skin mesh
        const skinParts = [bodyGeo, leftArm, rightArm, leftLeg, rightLeg];
        const unifiedSkin = LoftEngine.weld(skinParts, 0.01);
        
        // Generate facial features (separate geometry for animation)
        const faceFeatures = FaceMeshGen.generateAll(humanDNA);
        
        // Generate hair (separate geometry for different material)
        const hairFeatures = HairMeshGen.generateAll(humanDNA);
        
        return {
            // Main unified skin mesh
            skin: unifiedSkin,
            
            // Facial detail geometries
            face: {
                features: faceFeatures.filter(f => f.geo).map(f => ({
                    geometry: f.geo,
                    type: f.type,
                    color: f.color,
                    side: f.side
                }))
            },
            
            // Hair geometries
            hair: hairFeatures.filter(h => h).map(h => ({
                geometry: h.geo,
                type: h.type,
                color: h.color
            })),
            
            // DNA used for this human
            dna: humanDNA,
            
            // Skin color derived from DNA
            skinColor: DNASystem.skinToneToColor(humanDNA.skinTone, humanDNA.skinSubtone)
        };
    },

    /**
     * Generate just the unified skin mesh (for simpler use cases)
     */
    generateSkinOnly: (dna = null) => {
        const humanDNA = dna || DNASystem.generateRandom();
        
        const bodyGeo = BodyMeshGen.generate(humanDNA);
        const leftArm = LimbMeshGen.generateArm('left', humanDNA);
        const rightArm = LimbMeshGen.generateArm('right', humanDNA);
        const leftLeg = LimbMeshGen.generateLeg('left', humanDNA);
        const rightLeg = LimbMeshGen.generateLeg('right', humanDNA);
        
        return LoftEngine.weld([bodyGeo, leftArm, rightArm, leftLeg, rightLeg], 0.01);
    },

    /**
     * Generate human with specific preset
     */
    generateFromPreset: (preset) => {
        const dna = DNASystem.fromPreset(preset);
        return UnifiedHumanGen.generate(dna);
    }
};
