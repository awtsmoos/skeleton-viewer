// B"H
/**
 * LegMesh: The Divine Foundation - Detailed Leg Generation
 * Creates complete legs from hip to toes with anatomical detail
 */

import { LoftEngine } from '../../geometry/LoftEngine.js';
import { Vec3 } from '../../math/Vec3.js';

export const LegMesh = {
    /**
     * Generate complete leg mesh (used for attachment, not main body)
     * Main body already includes leg profile, this is for separation if needed
     * @param {string} side - 'left' or 'right'
     * @param {Object} dna - DNA parameters
     * @returns {Object} Geometry with vertices, normals, indices
     */
    generate: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const muscle = dna.muscleMass || 1.0;
        const fat = 1 + (dna.bodyFat || 0.1) * 0.4;
        const legLength = dna.legLength || 1.0;
        
        const sections = LegMesh.getLegProfile(side, dna);
        const vertices = [];
        const normals = [];
        const indices = [];
        const segments = 20;
        
        // Generate rings for each cross-section
        sections.forEach((section, sectionIdx) => {
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const cos = Math.cos(theta);
                const sin = Math.sin(theta);
                
                let rx = section.rx;
                let ry = section.ry || section.rx;
                
                // Apply muscle definition
                if (section.modulation) {
                    section.modulation.forEach(mod => {
                        const angleDiff = Math.abs(theta - mod.angle);
                        const wrapDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
                        if (wrapDiff < mod.width) {
                            const influence = Math.cos((wrapDiff / mod.width) * Math.PI * 0.5);
                            rx += mod.intensity * muscle * influence;
                            ry += mod.intensity * muscle * influence;
                        }
                    });
                }
                
                const x = section.x + cos * rx;
                const y = section.y;
                const z = section.z + sin * ry;
                
                vertices.push(x, y, z);
                normals.push(cos, 0, sin);
            }
        });
        
        // Connect rings
        const vertsPerRing = segments + 1;
        for (let s = 0; s < sections.length - 1; s++) {
            const ringStart = s * vertsPerRing;
            const nextRingStart = (s + 1) * vertsPerRing;
            
            for (let i = 0; i < segments; i++) {
                const a = ringStart + i;
                const b = ringStart + i + 1;
                const c = nextRingStart + i;
                const d = nextRingStart + i + 1;
                
                indices.push(a, c, b);
                indices.push(b, c, d);
            }
        }
        
        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            indices: vertices.length / 3 > 65535 ? new Uint32Array(indices) : new Uint16Array(indices)
        };
    },

    /**
     * Get detailed leg profile
     */
    getLegProfile: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const muscle = dna.muscleMass || 1.0;
        const fat = 1 + (dna.bodyFat || 0.1) * 0.4;
        const hipW = dna.hipWidth || 1.0;
        
        const hipX = 0.11 * mult * hipW;
        
        const sections = [];
        
        // ===== HIP ATTACHMENT =====
        const thighR = 0.098 * fat * (0.88 + muscle * 0.2);
        
        sections.push({
            x: hipX, y: 0.78, z: 0,
            rx: thighR * 1.05, ry: thighR * 1.08,
            modulation: [
                { angle: Math.PI * 0.5 * mult, intensity: 0.025, width: 0.5 } // Hip bone
            ]
        });
        
        // ===== THIGH =====
        sections.push({
            x: hipX, y: 0.70, z: 0.015,
            rx: thighR, ry: thighR * 1.05,
            modulation: [
                { angle: 0, intensity: 0.02 * muscle, width: 0.55 },      // Quad
                { angle: Math.PI, intensity: 0.018 * muscle, width: 0.6 } // Hamstring
            ]
        });
        sections.push({
            x: hipX, y: 0.60, z: 0.018,
            rx: thighR * 0.96, ry: thighR,
            modulation: [
                { angle: 0, intensity: 0.022 * muscle, width: 0.5 },
                { angle: Math.PI * 0.5 * mult, intensity: 0.015 * muscle, width: 0.45 },
                { angle: Math.PI, intensity: 0.02 * muscle, width: 0.55 }
            ]
        });
        sections.push({
            x: hipX, y: 0.50, z: 0.015,
            rx: thighR * 0.88, ry: thighR * 0.92
        });
        sections.push({
            x: hipX, y: 0.42, z: 0.01,
            rx: thighR * 0.75, ry: thighR * 0.78
        });
        
        // ===== KNEE =====
        sections.push({
            x: hipX, y: 0.36, z: 0.022,
            rx: 0.062, ry: 0.058,
            modulation: [
                { angle: 0, intensity: 0.015, width: 0.4 } // Patella
            ]
        });
        sections.push({
            x: hipX, y: 0.32, z: 0.015,
            rx: 0.058, ry: 0.055
        });
        
        // ===== CALF =====
        const calfR = 0.06 * (0.9 + muscle * 0.18);
        
        sections.push({
            x: hipX, y: 0.26, z: 0.005,
            rx: 0.052, ry: 0.054
        });
        sections.push({
            x: hipX, y: 0.20, z: -0.008,
            rx: calfR * 1.05, ry: calfR,
            modulation: [
                { angle: Math.PI, intensity: 0.022 * muscle, width: 0.65 } // Gastrocnemius
            ]
        });
        sections.push({
            x: hipX, y: 0.14, z: -0.005,
            rx: calfR * 0.85, ry: calfR * 0.82
        });
        sections.push({
            x: hipX, y: 0.10, z: 0,
            rx: 0.042, ry: 0.04
        });
        
        // ===== ANKLE =====
        sections.push({
            x: hipX, y: 0.07, z: 0.005,
            rx: 0.038, ry: 0.035
        });
        sections.push({
            x: hipX, y: 0.05, z: 0.01,
            rx: 0.035, ry: 0.032
        });
        
        return sections;
    },

    /**
     * Generate detailed foot mesh
     */
    generateFoot: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const footSize = dna.footSize || 1.0;
        const hipW = dna.hipWidth || 1.0;
        
        const parts = [];
        const baseX = 0.11 * mult * hipW;
        const ankleY = 0.05;
        
        // Main foot body
        const footPts = [
            { x: baseX, y: ankleY, z: 0.01 },
            { x: baseX, y: 0.035, z: 0.04 },
            { x: baseX, y: 0.025, z: 0.08 },
            { x: baseX, y: 0.018, z: 0.12 },
            { x: baseX, y: 0.012, z: 0.15 },
            { x: baseX, y: 0.008, z: 0.17 }
        ];
        
        const footRadii = [
            0.035 * footSize,
            0.042 * footSize,
            0.048 * footSize,
            0.042 * footSize,
            0.035 * footSize,
            0.022 * footSize
        ];
        
        parts.push(LoftEngine.loftPath(footPts, footRadii, 14));
        
        // Heel
        const heelPts = [
            { x: baseX, y: 0.035, z: -0.02 },
            { x: baseX, y: 0.02, z: -0.035 },
            { x: baseX, y: 0.008, z: -0.03 }
        ];
        parts.push(LoftEngine.loftPath(heelPts, [0.035 * footSize, 0.04 * footSize, 0.032 * footSize], 10));
        
        // Toes
        const toeData = [
            { offset: 0, length: 0.028, radius: 0.012 },       // Big toe
            { offset: 0.015 * mult, length: 0.022, radius: 0.008 },
            { offset: 0.028 * mult, length: 0.02, radius: 0.007 },
            { offset: 0.038 * mult, length: 0.018, radius: 0.006 },
            { offset: 0.046 * mult, length: 0.015, radius: 0.005 }  // Pinky toe
        ];
        
        toeData.forEach((toe, idx) => {
            const toeX = baseX + toe.offset;
            const toeY = 0.008;
            const toeZ = 0.17;
            
            const pts = [
                { x: toeX, y: toeY, z: toeZ },
                { x: toeX, y: toeY - 0.002, z: toeZ + toe.length * footSize }
            ];
            parts.push(LoftEngine.loftPath(pts, [toe.radius * footSize, toe.radius * footSize * 0.6], 6));
        });
        
        return LoftEngine.weld(parts, 0.003);
    },

    /**
     * Generate both legs with feet
     */
    generateBoth: (dna = {}) => {
        return {
            left: LegMesh.generate('left', dna),
            right: LegMesh.generate('right', dna),
            leftFoot: LegMesh.generateFoot('left', dna),
            rightFoot: LegMesh.generateFoot('right', dna)
        };
    }
};
