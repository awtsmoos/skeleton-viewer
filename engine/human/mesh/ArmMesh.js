// B"H
/**
 * ArmMesh: The Divine Extensions - Detailed Arm Generation
 * Creates complete arms from shoulder to fingertips with anatomical detail
 */

import { LoftEngine } from '../../geometry/LoftEngine.js';
import { Vec3 } from '../../math/Vec3.js';

export const ArmMesh = {
    /**
     * Generate complete arm mesh
     * @param {string} side - 'left' or 'right'
     * @param {Object} dna - DNA parameters
     * @returns {Object} Geometry with vertices, normals, indices
     */
    generate: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const muscle = dna.muscleMass || 1.0;
        const armLength = dna.armLength || 1.0;
        const fat = 1 + (dna.bodyFat || 0.1) * 0.3;
        
        const sections = ArmMesh.getArmProfile(side, dna);
        const vertices = [];
        const normals = [];
        const indices = [];
        const segments = 18;
        
        // Generate rings for each cross-section
        sections.forEach((section, sectionIdx) => {
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const cos = Math.cos(theta);
                const sin = Math.sin(theta);
                
                // Apply muscle definition
                let rx = section.rx;
                let ry = section.ry || section.rx;
                
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
                
                const nx = cos;
                const nz = sin;
                normals.push(nx, 0, nz);
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
        
        // Add end cap (fingertips handled in hand generation)
        const lastSection = sections[sections.length - 1];
        const tipIdx = vertices.length / 3;
        vertices.push(lastSection.x, lastSection.y - 0.01, lastSection.z);
        normals.push(0, -1, 0);
        
        const lastRingStart = (sections.length - 1) * vertsPerRing;
        for (let i = 0; i < segments; i++) {
            indices.push(lastRingStart + i + 1, tipIdx, lastRingStart + i);
        }
        
        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            indices: vertices.length / 3 > 65535 ? new Uint32Array(indices) : new Uint16Array(indices)
        };
    },

    /**
     * Get detailed arm profile from shoulder to wrist
     */
    getArmProfile: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const muscle = dna.muscleMass || 1.0;
        const shoulderW = dna.shoulderWidth || 1.0;
        const armLength = dna.armLength || 1.0;
        
        // Shoulder attachment point
        const shoulderX = 0.19 * mult * shoulderW;
        const shoulderY = 1.38;
        const shoulderZ = 0;
        
        // Arm hangs at slight offset
        const armX = shoulderX + 0.015 * mult;
        
        const sections = [];
        
        // ===== SHOULDER/DELTOID =====
        sections.push({
            x: shoulderX, y: 1.38, z: 0,
            rx: 0.055 * (0.95 + muscle * 0.1), ry: 0.048,
            modulation: [
                { angle: Math.PI * 0.5 * mult, intensity: 0.02 * muscle, width: 0.6 }
            ]
        });
        
        // ===== UPPER ARM (HUMERUS) =====
        const bicepR = 0.042 + muscle * 0.018;
        const tricepR = 0.038 + muscle * 0.012;
        
        sections.push({
            x: armX, y: 1.32, z: 0.01,
            rx: 0.048 * (0.9 + muscle * 0.15), ry: 0.045,
            modulation: [
                { angle: 0, intensity: 0.015 * muscle, width: 0.5 },      // Bicep
                { angle: Math.PI, intensity: 0.012 * muscle, width: 0.5 } // Tricep
            ]
        });
        sections.push({
            x: armX, y: 1.24, z: 0.015,
            rx: bicepR, ry: 0.04,
            modulation: [
                { angle: 0, intensity: 0.022 * muscle, width: 0.55 },     // Bicep peak
                { angle: Math.PI, intensity: 0.015 * muscle, width: 0.6 } // Tricep
            ]
        });
        sections.push({
            x: armX, y: 1.16, z: 0.012,
            rx: bicepR * 0.92, ry: 0.038,
            modulation: [
                { angle: 0, intensity: 0.018 * muscle, width: 0.5 },
                { angle: Math.PI, intensity: 0.012 * muscle, width: 0.55 }
            ]
        });
        sections.push({
            x: armX, y: 1.08, z: 0.008,
            rx: 0.038, ry: 0.035
        });
        
        // ===== ELBOW =====
        sections.push({
            x: armX, y: 1.04, z: 0.008,
            rx: 0.038, ry: 0.035
        });
        sections.push({
            x: armX, y: 1.00, z: 0.005,
            rx: 0.036, ry: 0.034
        });
        
        // ===== FOREARM =====
        const forearmR = 0.036 + muscle * 0.008;
        
        sections.push({
            x: armX, y: 0.95, z: 0.008,
            rx: forearmR * 1.05, ry: forearmR,
            modulation: [
                { angle: 0, intensity: 0.012 * muscle, width: 0.5 },       // Brachioradialis
                { angle: Math.PI, intensity: 0.008 * muscle, width: 0.45 } // Extensors
            ]
        });
        sections.push({
            x: armX, y: 0.88, z: 0.006,
            rx: forearmR, ry: forearmR * 0.95
        });
        sections.push({
            x: armX, y: 0.80, z: 0.005,
            rx: forearmR * 0.85, ry: forearmR * 0.82
        });
        
        // ===== WRIST =====
        sections.push({
            x: armX, y: 0.74, z: 0.004,
            rx: 0.028, ry: 0.022
        });
        sections.push({
            x: armX, y: 0.72, z: 0.004,
            rx: 0.026, ry: 0.02
        });
        
        return sections;
    },

    /**
     * Generate complete hand mesh
     */
    generateHand: (side, dna = {}) => {
        const mult = side === 'right' ? 1 : -1;
        const handSize = dna.handSize || 1.0;
        const shoulderW = dna.shoulderWidth || 1.0;
        
        const parts = [];
        const baseX = (0.19 * shoulderW + 0.015) * mult;
        const wristY = 0.72;
        
        // Palm
        const palmPts = [
            { x: baseX, y: wristY, z: 0.004 },
            { x: baseX, y: wristY - 0.025, z: 0.008 },
            { x: baseX, y: wristY - 0.05, z: 0.012 },
            { x: baseX, y: wristY - 0.075, z: 0.015 },
            { x: baseX, y: wristY - 0.095, z: 0.012 }
        ];
        const palmRadii = [
            0.026 * handSize,
            0.032 * handSize,
            0.035 * handSize,
            0.033 * handSize,
            0.018 * handSize
        ];
        parts.push(LoftEngine.loftPath(palmPts, palmRadii, 14));
        
        // Fingers
        const fingerData = [
            { name: 'thumb', baseOffset: [-0.025 * mult, -0.035, 0.018], length: 0.045, segs: 2 },
            { name: 'index', baseOffset: [-0.018 * mult, -0.095, 0.012], length: 0.055, segs: 3 },
            { name: 'middle', baseOffset: [0, -0.1, 0.012], length: 0.06, segs: 3 },
            { name: 'ring', baseOffset: [0.014 * mult, -0.098, 0.012], length: 0.055, segs: 3 },
            { name: 'pinky', baseOffset: [0.026 * mult, -0.092, 0.012], length: 0.045, segs: 3 }
        ];
        
        fingerData.forEach((finger, idx) => {
            const fx = baseX + finger.baseOffset[0];
            const fy = wristY + finger.baseOffset[1];
            const fz = finger.baseOffset[2];
            const segLen = (finger.length * handSize) / finger.segs;
            const isThumb = idx === 0;
            
            let currentY = fy;
            let radius = isThumb ? 0.01 * handSize : 0.008 * handSize;
            
            for (let seg = 0; seg < finger.segs; seg++) {
                const nextY = currentY - segLen;
                const pts = [
                    { x: fx, y: currentY, z: fz },
                    { x: fx, y: nextY, z: fz }
                ];
                parts.push(LoftEngine.loftPath(pts, [radius, radius * 0.88], 8));
                currentY = nextY;
                radius *= 0.85;
            }
            
            // Fingertip
            const tipPts = [
                { x: fx, y: currentY, z: fz },
                { x: fx, y: currentY - 0.008 * handSize, z: fz + 0.002 }
            ];
            parts.push(LoftEngine.loftPath(tipPts, [radius, radius * 0.3], 6));
        });
        
        return LoftEngine.weld(parts, 0.003);
    },

    /**
     * Generate both arms
     */
    generateBoth: (dna = {}) => {
        return {
            left: ArmMesh.generate('left', dna),
            right: ArmMesh.generate('right', dna),
            leftHand: ArmMesh.generateHand('left', dna),
            rightHand: ArmMesh.generateHand('right', dna)
        };
    }
};
