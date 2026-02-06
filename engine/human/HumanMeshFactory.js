// B"H
/**
 * HumanMeshFactory: The Divine Assembly
 * Combines all human mesh components into a SINGLE unified mesh
 * This is the MAIN entry point for human generation
 */

import { LoftEngine } from '../geometry/LoftEngine.js';
import { UnifiedBodyMesh } from './mesh/UnifiedBodyMesh.js';
import { RealisticFaceMesh } from './mesh/RealisticFaceMesh.js';
import { ArmMesh } from './mesh/ArmMesh.js';
import { LegMesh } from './mesh/LegMesh.js';
import { HairMeshGen } from './mesh/HairMeshGen.js';
import { DNASystem } from './DNASystem.js';

export const HumanMeshFactory = {
    /**
     * Generate complete unified human mesh
     * @param {Object} dna - Optional DNA parameters
     * @returns {Object} Complete human with skin, face features, hair
     */
    generate: (dna = null) => {
        const humanDNA = dna || DNASystem.generateRandom();
        const skinColor = DNASystem.skinToneToColor(humanDNA.skinTone, humanDNA.skinSubtone);
        
        // 1. Generate main body (torso + head + legs unified)
        const bodyMesh = UnifiedBodyMesh.generate(humanDNA);
        
        // 2. Generate arms separately (will be welded)
        const leftArm = ArmMesh.generate('left', humanDNA);
        const rightArm = ArmMesh.generate('right', humanDNA);
        const leftHand = ArmMesh.generateHand('left', humanDNA);
        const rightHand = ArmMesh.generateHand('right', humanDNA);
        
        // 3. Generate feet
        const leftFoot = LegMesh.generateFoot('left', humanDNA);
        const rightFoot = LegMesh.generateFoot('right', humanDNA);
        
        // 4. Weld all skin parts into ONE mesh
        const allSkinParts = [
            bodyMesh,
            leftArm,
            rightArm,
            leftHand,
            rightHand,
            leftFoot,
            rightFoot
        ].filter(p => p && p.vertices && p.vertices.length > 0);
        
        const unifiedSkin = LoftEngine.weld(allSkinParts, 0.008);
        
        // 5. Generate facial features (separate for animation/rendering)
        const faceFeatures = RealisticFaceMesh.generateAll(humanDNA);
        
        // 6. Generate hair
        const hairFeatures = HairMeshGen.generateAll(humanDNA);
        
        return {
            // The ONE unified skin mesh
            skin: unifiedSkin,
            
            // Facial detail geometries (for separate rendering/materials)
            face: {
                features: faceFeatures.filter(f => f && f.geometry).map(f => ({
                    geometry: f.geometry,
                    type: f.type,
                    color: f.color || skinColor,
                    side: f.side,
                    transparent: f.transparent || false
                }))
            },
            
            // Hair geometries
            hair: hairFeatures.filter(h => h && h.geo).map(h => ({
                geometry: h.geo,
                type: h.type,
                color: h.color || humanDNA.hairColor
            })),
            
            // DNA used
            dna: humanDNA,
            
            // Skin color for shading
            skinColor: skinColor,
            
            // Statistics
            stats: {
                skinVertices: unifiedSkin.vertices.length / 3,
                faceFeatures: faceFeatures.length,
                hairParts: hairFeatures.length
            }
        };
    },

    /**
     * Generate just the unified skin mesh (faster, no face/hair details)
     */
    generateSkinOnly: (dna = null) => {
        const humanDNA = dna || DNASystem.generateRandom();
        
        const bodyMesh = UnifiedBodyMesh.generate(humanDNA);
        const leftArm = ArmMesh.generate('left', humanDNA);
        const rightArm = ArmMesh.generate('right', humanDNA);
        const leftHand = ArmMesh.generateHand('left', humanDNA);
        const rightHand = ArmMesh.generateHand('right', humanDNA);
        const leftFoot = LegMesh.generateFoot('left', humanDNA);
        const rightFoot = LegMesh.generateFoot('right', humanDNA);
        
        const allParts = [
            bodyMesh, leftArm, rightArm, leftHand, rightHand, leftFoot, rightFoot
        ].filter(p => p && p.vertices && p.vertices.length > 0);
        
        return LoftEngine.weld(allParts, 0.008);
    },

    /**
     * Generate human with specific preset
     */
    generateFromPreset: (preset) => {
        const dna = DNASystem.fromPreset(preset);
        return HumanMeshFactory.generate(dna);
    },

    /**
     * Get available presets
     */
    getPresets: () => ['athletic', 'slim', 'heavy', 'tall', 'short']
};
