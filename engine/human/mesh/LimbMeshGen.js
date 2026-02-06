// B"H
/**
 * LimbMeshGen: The Divine Extensions - Arms and Legs Mesh Generation
 * Creates detailed arm and leg meshes with muscle definition
 */
import { Vec3 } from '../../math/Vec3.js';
import { LoftEngine } from '../../geometry/LoftEngine.js';

export const LimbMeshGen = {
    /**
     * Generate arm mesh (shoulder to fingertips)
     * @param {string} side - 'left' or 'right'
     * @param {Object} dna - DNA parameters
     * @returns {Object} Geometry with vertices, normals, indices
     */
    generateArm: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const muscle = dna.muscleMass || 1.0;
        const armLength = dna.armLength || 1.0;
        const handSize = dna.handSize || 1.0;
        
        const parts = [];
        
        // Shoulder attachment point
        const shoulderX = 0.18 * mult;
        const shoulderY = 1.38;
        
        // Upper arm (humerus region)
        const upperArmPts = [
            { x: shoulderX, y: shoulderY, z: 0 },
            { x: shoulderX + 0.02 * mult, y: 1.32, z: 0.01 },
            { x: shoulderX + 0.02 * mult, y: 1.22, z: 0.015 },
            { x: shoulderX + 0.02 * mult, y: 1.12, z: 0.01 },
            { x: shoulderX + 0.02 * mult, y: 1.05, z: 0.008 }
        ];
        
        const bicepBulge = 0.035 + muscle * 0.015;
        const upperArmRadii = [
            0.05,                          // Shoulder cap
            0.048 + muscle * 0.008,        // Deltoid
            bicepBulge,                    // Bicep peak
            0.04 + muscle * 0.005,         // Lower upper arm
            0.038                          // Elbow
        ];
        
        parts.push(LoftEngine.loftPath(upperArmPts, upperArmRadii, 14));
        
        // Elbow region
        const elbowPts = [
            { x: shoulderX + 0.02 * mult, y: 1.05, z: 0.008 },
            { x: shoulderX + 0.02 * mult, y: 1.02, z: 0.005 }
        ];
        parts.push(LoftEngine.loftPath(elbowPts, [0.038, 0.035], 12));
        
        // Forearm
        const forearmPts = [
            { x: shoulderX + 0.02 * mult, y: 1.02, z: 0.005 },
            { x: shoulderX + 0.02 * mult, y: 0.95, z: 0.01 },
            { x: shoulderX + 0.02 * mult, y: 0.85, z: 0.008 },
            { x: shoulderX + 0.02 * mult, y: 0.75, z: 0.005 }
        ];
        const forearmRadii = [
            0.035,                         // Below elbow
            0.038 + muscle * 0.005,        // Forearm muscle
            0.032,                         // Mid forearm
            0.025                          // Wrist
        ];
        parts.push(LoftEngine.loftPath(forearmPts, forearmRadii, 12));
        
        // Wrist
        const wristY = 0.75;
        const wristPts = [
            { x: shoulderX + 0.02 * mult, y: wristY, z: 0.005 },
            { x: shoulderX + 0.02 * mult, y: wristY - 0.02, z: 0.005 }
        ];
        parts.push(LoftEngine.loftPath(wristPts, [0.025, 0.022], 10));
        
        // Hand (palm)
        const handPts = [
            { x: shoulderX + 0.02 * mult, y: wristY - 0.02, z: 0.005 },
            { x: shoulderX + 0.02 * mult, y: wristY - 0.04, z: 0.01 },
            { x: shoulderX + 0.02 * mult, y: wristY - 0.07, z: 0.012 },
            { x: shoulderX + 0.02 * mult, y: wristY - 0.09, z: 0.01 }
        ];
        const handRadii = [0.022, 0.03 * handSize, 0.028 * handSize, 0.015 * handSize];
        parts.push(LoftEngine.loftPath(handPts, handRadii, 10));
        
        // Fingers
        const fingerLengths = [0.04, 0.05, 0.052, 0.048, 0.04]; // Thumb, index, middle, ring, pinky
        const fingerBases = [
            { x: shoulderX + 0.02 * mult - 0.02 * mult, y: wristY - 0.06, z: 0.015 }, // Thumb
            { x: shoulderX + 0.02 * mult - 0.015 * mult, y: wristY - 0.09, z: 0.01 },
            { x: shoulderX + 0.02 * mult, y: wristY - 0.095, z: 0.01 },
            { x: shoulderX + 0.02 * mult + 0.012 * mult, y: wristY - 0.09, z: 0.01 },
            { x: shoulderX + 0.02 * mult + 0.022 * mult, y: wristY - 0.085, z: 0.01 }
        ];
        
        fingerBases.forEach((base, idx) => {
            const len = fingerLengths[idx] * handSize;
            const isThumb = idx === 0;
            const segs = isThumb ? 2 : 3;
            const segLen = len / segs;
            
            let currentY = base.y;
            let currentZ = base.z;
            let radius = isThumb ? 0.008 : 0.006;
            
            for (let seg = 0; seg < segs; seg++) {
                const nextY = currentY - segLen;
                const pts = [
                    { x: base.x, y: currentY, z: currentZ },
                    { x: base.x, y: nextY, z: currentZ }
                ];
                parts.push(LoftEngine.loftPath(pts, [radius, radius * 0.9], 6));
                currentY = nextY;
                radius *= 0.85;
            }
        });
        
        return LoftEngine.weld(parts, 0.003);
    },

    /**
     * Generate leg mesh (hip to toes)
     * @param {string} side - 'left' or 'right'
     * @param {Object} dna - DNA parameters
     * @returns {Object} Geometry with vertices, normals, indices
     */
    generateLeg: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const muscle = dna.muscleMass || 1.0;
        const legLength = dna.legLength || 1.0;
        const footSize = dna.footSize || 1.0;
        const fat = dna.bodyFat || 0.1;
        
        const parts = [];
        
        // Hip attachment point
        const hipX = 0.1 * mult;
        const hipY = 0.78;
        
        // Upper leg (femur region - thigh)
        const thighR = 0.09 * (1 + fat * 0.3) * (0.9 + muscle * 0.15);
        const thighPts = [
            { x: hipX, y: hipY, z: 0 },
            { x: hipX, y: 0.68, z: 0.015 },
            { x: hipX, y: 0.58, z: 0.02 },
            { x: hipX, y: 0.48, z: 0.018 },
            { x: hipX, y: 0.40, z: 0.01 },
            { x: hipX, y: 0.35, z: 0.02 }
        ];
        const thighRadii = [
            thighR * 1.05,                 // Hip
            thighR,                        // Upper thigh
            thighR * 0.95,                 // Mid thigh (quad)
            thighR * 0.85,                 // Lower thigh
            0.058,                         // Above knee
            0.055                          // Knee
        ];
        parts.push(LoftEngine.loftPath(thighPts, thighRadii, 16));
        
        // Knee region
        const kneePts = [
            { x: hipX, y: 0.35, z: 0.02 },
            { x: hipX, y: 0.32, z: 0.015 }
        ];
        parts.push(LoftEngine.loftPath(kneePts, [0.055, 0.05], 14));
        
        // Lower leg (calf/shin)
        const calfR = 0.055 * (0.9 + muscle * 0.15);
        const calfPts = [
            { x: hipX, y: 0.32, z: 0.015 },
            { x: hipX, y: 0.25, z: 0.005 },
            { x: hipX, y: 0.18, z: -0.01 },
            { x: hipX, y: 0.12, z: -0.005 },
            { x: hipX, y: 0.08, z: 0 }
        ];
        const calfRadii = [
            0.05,                          // Below knee
            calfR,                         // Calf muscle
            calfR * 1.1,                   // Calf peak
            calfR * 0.7,                   // Lower calf
            0.035                          // Ankle
        ];
        parts.push(LoftEngine.loftPath(calfPts, calfRadii, 14));
        
        // Ankle region
        const anklePts = [
            { x: hipX, y: 0.08, z: 0 },
            { x: hipX, y: 0.05, z: 0.01 }
        ];
        parts.push(LoftEngine.loftPath(anklePts, [0.035, 0.032], 12));
        
        // Foot
        const footPts = [
            { x: hipX, y: 0.05, z: 0.01 },
            { x: hipX, y: 0.03, z: 0.04 },
            { x: hipX, y: 0.02, z: 0.08 },
            { x: hipX, y: 0.015, z: 0.12 },
            { x: hipX, y: 0.01, z: 0.14 }
        ];
        const footRadii = [
            0.032,
            0.035 * footSize,
            0.04 * footSize,
            0.035 * footSize,
            0.02 * footSize
        ];
        parts.push(LoftEngine.loftPath(footPts, footRadii, 10));
        
        // Toes (simplified)
        const toeBase = { x: hipX, y: 0.01, z: 0.14 };
        for (let t = 0; t < 5; t++) {
            const toeX = hipX + (t - 2) * 0.012 * mult;
            const toeLen = t === 0 ? 0.025 : 0.018 - t * 0.002;
            const pts = [
                { x: toeX, y: 0.01, z: 0.14 },
                { x: toeX, y: 0.01, z: 0.14 + toeLen }
            ];
            parts.push(LoftEngine.loftPath(pts, [t === 0 ? 0.01 : 0.007, 0.004], 6));
        }
        
        return LoftEngine.weld(parts, 0.003);
    },

    /**
     * Generate both arms
     */
    generateArms: (dna = {}) => {
        return [
            LimbMeshGen.generateArm('left', dna),
            LimbMeshGen.generateArm('right', dna)
        ];
    },

    /**
     * Generate both legs
     */
    generateLegs: (dna = {}) => {
        return [
            LimbMeshGen.generateLeg('left', dna),
            LimbMeshGen.generateLeg('right', dna)
        ];
    }
};
