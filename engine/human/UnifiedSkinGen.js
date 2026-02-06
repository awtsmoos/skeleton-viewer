// B"H
/**
 * UnifiedSkinGen: The Divine Outer Garment
 * Creates ONE continuous skin mesh for the entire human body
 */

import { LoftEngine } from '../geometry/LoftEngine.js';
import { Vec3 } from '../math/Vec3.js';
import { BodyProfile } from './BodyProfile.js';
import { ArmProfile } from './ArmProfile.js';
import { FaceData } from './FaceData.js';

export const UnifiedSkinGen = {
    /**
     * Generate unified skin mesh from profiles
     * Creates ONE continuous mesh, not multiple overlapping ones
     */
    generate: (dna = null) => {
        const parts = [];

        // 1. Generate main torso+head as primary mesh
        const torsoMesh = UnifiedSkinGen.generateTorsoHead(dna);
        parts.push(torsoMesh);

        // 2. Generate arms (connected at shoulders)
        const leftArm = UnifiedSkinGen.generateArm('left', dna);
        const rightArm = UnifiedSkinGen.generateArm('right', dna);
        parts.push(leftArm);
        parts.push(rightArm);

        // 3. Generate legs (already part of body profile, but add detail)
        const leftLeg = UnifiedSkinGen.generateLeg('left', dna);
        const rightLeg = UnifiedSkinGen.generateLeg('right', dna);
        parts.push(leftLeg);
        parts.push(rightLeg);

        // 4. Add facial features (eyes, nose detail, ears)
        const faceFeatures = UnifiedSkinGen.generateFaceDetails(dna);
        parts.push(...faceFeatures);

        // 5. Weld everything into ONE unified mesh
        return LoftEngine.weld(parts, 0.005);
    },

    /**
     * Generate main torso and head as lofted mesh
     */
    generateTorsoHead: (dna) => {
        const profile = BodyProfile.getFullProfile(dna);
        const points = [];
        const radii = [];
        const segments = 32; // High res for smooth skin

        // Filter to single-shape sections (main body column)
        const mainBody = profile.filter(s => 
            s.shapes.length === 1 && !s.shapes[0].side
        );

        mainBody.forEach(section => {
            const shape = section.shapes[0];
            points.push({
                x: shape.cx || 0,
                y: section.y,
                z: shape.cz || 0
            });
            // Use average of rx and rz for circular cross-section
            radii.push((shape.rx + (shape.rz || shape.rx)) / 2);
        });

        if (points.length < 2) {
            // Fallback to basic profile
            return UnifiedSkinGen.generateBasicTorso(dna);
        }

        return LoftEngine.loftPath(points, radii, segments);
    },

    /**
     * Fallback basic torso generation
     */
    generateBasicTorso: (dna) => {
        const height = dna?.height || 1.0;
        const muscle = dna?.muscleMass || 1.0;

        const points = [
            { x: 0, y: 0.85, z: 0 },      // Pelvis
            { x: 0, y: 0.95, z: 0.02 },   // Lower abs
            { x: 0, y: 1.05, z: 0.03 },   // Upper abs
            { x: 0, y: 1.18, z: 0.04 },   // Chest
            { x: 0, y: 1.32, z: 0.03 },   // Upper chest
            { x: 0, y: 1.42, z: 0.01 },   // Neck base
            { x: 0, y: 1.52, z: 0.02 },   // Neck top
            { x: 0, y: 1.62, z: 0.05 },   // Chin
            { x: 0, y: 1.70, z: 0.04 },   // Face
            { x: 0, y: 1.78, z: 0 },      // Forehead
            { x: 0, y: 1.82, z: -0.02 }   // Crown
        ];

        const radii = [
            0.14,  // Pelvis
            0.12,  // Lower abs
            0.13 * muscle, // Upper abs
            0.16 * muscle, // Chest
            0.17,  // Upper chest
            0.065, // Neck base
            0.05,  // Neck top
            0.07,  // Chin
            0.1,   // Face
            0.11,  // Forehead
            0.06   // Crown
        ];

        return LoftEngine.loftPath(points, radii, 32);
    },

    /**
     * Generate arm mesh
     */
    generateArm: (side, dna) => {
        const sections = ArmProfile.getArmSections(side, dna);
        const points = [];
        const radii = [];

        sections.forEach(s => {
            points.push({ x: s.cx, y: s.y, z: s.cz || 0 });
            radii.push((s.rx + (s.ry || s.rx)) / 2);
        });

        return LoftEngine.loftPath(points, radii, 16);
    },

    /**
     * Generate leg mesh
     */
    generateLeg: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        const baseX = 0.1 * mult;
        const muscle = dna?.muscleMass || 1.0;
        const fat = dna?.bodyFat || 0.1;

        const thighR = 0.085 * (0.9 + muscle * 0.15 + fat * 0.3);
        const calfR = 0.055 * (0.9 + muscle * 0.15);

        const points = [
            { x: baseX, y: 0.78, z: 0 },      // Hip
            { x: baseX, y: 0.65, z: 0.02 },   // Upper thigh
            { x: baseX, y: 0.52, z: 0.025 },  // Mid thigh
            { x: baseX, y: 0.42, z: 0.02 },   // Lower thigh
            { x: baseX, y: 0.35, z: 0.02 },   // Knee
            { x: baseX, y: 0.28, z: 0 },      // Upper calf
            { x: baseX, y: 0.18, z: -0.01 },  // Calf peak
            { x: baseX, y: 0.10, z: -0.005 }, // Lower calf
            { x: baseX, y: 0.05, z: 0 }       // Ankle
        ];

        const radii = [
            thighR * 0.95,   // Hip
            thighR,          // Upper thigh
            thighR * 0.95,   // Mid thigh
            thighR * 0.75,   // Lower thigh
            0.055,           // Knee
            calfR,           // Upper calf
            calfR * 1.1,     // Calf peak
            calfR * 0.7,     // Lower calf
            0.035            // Ankle
        ];

        return LoftEngine.loftPath(points, radii, 18);
    },

    /**
     * Generate detailed facial features
     */
    generateFaceDetails: (dna) => {
        const parts = [];

        // Nose
        const nose = UnifiedSkinGen.generateNose(dna);
        parts.push(nose);

        // Ears
        parts.push(UnifiedSkinGen.generateEar('left', dna));
        parts.push(UnifiedSkinGen.generateEar('right', dna));

        // Eyeballs (separate geometry for animation)
        parts.push(UnifiedSkinGen.generateEyeball('left', dna));
        parts.push(UnifiedSkinGen.generateEyeball('right', dna));

        return parts;
    },

    /**
     * Generate nose geometry
     */
    generateNose: (dna) => {
        const noseSize = dna?.noseSize || 1.0;
        const points = [
            { x: 0, y: 1.68, z: 0.1 },   // Bridge
            { x: 0, y: 1.64, z: 0.115 }, // Mid bridge
            { x: 0, y: 1.62, z: 0.12 },  // Tip
            { x: 0, y: 1.605, z: 0.11 }  // Base
        ];
        const radii = [
            0.012 * noseSize,
            0.014 * noseSize,
            0.018 * noseSize,
            0.015 * noseSize
        ];
        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Generate ear geometry
     */
    generateEar: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        const x = 0.1 * mult;
        const points = [
            { x: x, y: 1.7, z: 0 },
            { x: x * 1.02, y: 1.68, z: -0.005 },
            { x: x, y: 1.65, z: 0 }
        ];
        const radii = [0.01, 0.015, 0.008];
        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Generate eyeball geometry
     */
    generateEyeball: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        const x = 0.035 * mult;
        const eyeColor = dna?.eyeColor || [0.35, 0.2, 0.1];

        // Simple sphere for now - will be enhanced with iris/pupil
        const points = [];
        const radii = [];
        const r = 0.012;
        const segs = 8;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const y = 1.7 + Math.cos(t * Math.PI) * r;
            const z = 0.085 + Math.sin(t * Math.PI) * r * 0.5;
            points.push({ x, y, z });
            radii.push(Math.sin(t * Math.PI) * r);
        }

        return LoftEngine.loftPath(points, radii, 12);
    }
};
