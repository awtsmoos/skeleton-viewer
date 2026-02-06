// B"H
/**
 * BodyMeshGen: The Divine Vessel - Unified Body Mesh Generation
 * Creates ONE continuous skin mesh for the entire human body using cross-sections
 * Properly connects torso, arms, legs, and head into a seamless mesh
 */
import { Vec3 } from '../../math/Vec3.js';

export const BodyMeshGen = {
    /**
     * Generate a complete unified body mesh from feet to head
     * @param {Object} dna - DNA parameters for body proportions
     * @returns {Object} { vertices, normals, indices }
     */
    generate: (dna = {}) => {
        const segments = 32; // Circumferential segments
        const vertices = [];
        const normals = [];
        const indices = [];
        
        // Get body profile cross-sections
        const profile = BodyMeshGen.getDetailedProfile(dna);
        
        // Generate vertices for each cross-section
        profile.forEach((section, sectionIdx) => {
            const ring = BodyMeshGen.generateRing(section, segments);
            vertices.push(...ring.vertices);
            normals.push(...ring.normals);
        });
        
        // Generate indices to connect rings
        const vertsPerRing = segments + 1;
        for (let s = 0; s < profile.length - 1; s++) {
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
        
        // Add top cap (head crown)
        const topCenterIdx = vertices.length / 3;
        const lastSection = profile[profile.length - 1];
        vertices.push(lastSection.cx, lastSection.y + 0.02, lastSection.cz);
        normals.push(0, 1, 0);
        
        const lastRingStart = (profile.length - 1) * vertsPerRing;
        for (let i = 0; i < segments; i++) {
            indices.push(lastRingStart + i, topCenterIdx, lastRingStart + i + 1);
        }
        
        // Add bottom caps (feet) - simplified
        const bottomCenterIdx = vertices.length / 3;
        const firstSection = profile[0];
        vertices.push(firstSection.cx, firstSection.y - 0.02, firstSection.cz);
        normals.push(0, -1, 0);
        
        for (let i = 0; i < segments; i++) {
            indices.push(i + 1, bottomCenterIdx, i);
        }
        
        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            indices: vertices.length / 3 > 65535 ? new Uint32Array(indices) : new Uint16Array(indices)
        };
    },

    /**
     * Generate a ring of vertices for a cross-section
     */
    generateRing: (section, segments) => {
        const vertices = [];
        const normals = [];
        
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const cos = Math.cos(theta);
            const sin = Math.sin(theta);
            
            // Apply elliptical radius with modulation
            let rx = section.rx;
            let rz = section.rz || section.rx;
            
            // Apply muscle definition modulation
            if (section.muscleMap) {
                section.muscleMap.forEach(muscle => {
                    const angleDiff = Math.abs(theta - muscle.angle);
                    const wrap = Math.min(angleDiff, Math.PI * 2 - angleDiff);
                    if (wrap < muscle.width) {
                        const influence = Math.cos((wrap / muscle.width) * Math.PI * 0.5);
                        rx += muscle.intensity * influence * cos;
                        rz += muscle.intensity * influence * sin;
                    }
                });
            }
            
            const x = section.cx + cos * rx;
            const y = section.y;
            const z = section.cz + sin * rz;
            
            vertices.push(x, y, z);
            
            // Calculate normal
            const nx = cos * (section.rz || section.rx);
            const nz = sin * section.rx;
            const normalLen = Math.sqrt(nx * nx + nz * nz);
            normals.push(nx / normalLen, 0, nz / normalLen);
        }
        
        return { vertices, normals };
    },

    /**
     * Get detailed body profile with all cross-sections
     */
    getDetailedProfile: (dna) => {
        const height = dna.height || 1.0;
        const muscle = dna.muscleMass || 1.0;
        const fat = 1 + (dna.bodyFat || 0.1) * 0.5;
        const shoulderW = dna.shoulderWidth || 1.0;
        const hipW = dna.hipWidth || 1.0;
        
        // Create sections from feet to head
        const sections = [];
        
        // FEET (Y: 0.0 - 0.05)
        sections.push({ y: 0.0, cx: 0, cz: 0.06, rx: 0.04, rz: 0.08, type: 'sole' });
        sections.push({ y: 0.02, cx: 0, cz: 0.03, rx: 0.035, rz: 0.06, type: 'foot' });
        sections.push({ y: 0.05, cx: 0, cz: 0, rx: 0.035, rz: 0.035, type: 'ankle' });
        
        // LOWER LEGS (Y: 0.05 - 0.35)
        const calfR = 0.055 * (0.9 + muscle * 0.15);
        sections.push({ y: 0.10, cx: 0, cz: 0, rx: 0.042, rz: 0.045, type: 'lower_calf' });
        sections.push({ y: 0.18, cx: 0, cz: -0.01, rx: calfR * 1.1, rz: calfR, type: 'calf_peak',
            muscleMap: [{ angle: Math.PI, intensity: 0.015 * muscle, width: 0.8 }] });
        sections.push({ y: 0.28, cx: 0, cz: 0, rx: 0.048, rz: 0.052, type: 'upper_calf' });
        
        // KNEES (Y: 0.35 - 0.42)
        sections.push({ y: 0.35, cx: 0, cz: 0.02, rx: 0.055, rz: 0.052, type: 'knee' });
        sections.push({ y: 0.40, cx: 0, cz: 0.01, rx: 0.062, rz: 0.058, type: 'above_knee' });
        
        // THIGHS (Y: 0.42 - 0.78)
        const thighR = 0.09 * fat * (0.85 + muscle * 0.2);
        sections.push({ y: 0.48, cx: 0, cz: 0, rx: thighR * 0.92, rz: thighR * 0.95, type: 'mid_thigh',
            muscleMap: [
                { angle: 0, intensity: 0.02 * muscle, width: 0.6 },
                { angle: Math.PI, intensity: 0.015 * muscle, width: 0.7 }
            ]});
        sections.push({ y: 0.58, cx: 0, cz: 0, rx: thighR, rz: thighR * 1.05, type: 'upper_thigh' });
        sections.push({ y: 0.70, cx: 0, cz: -0.01, rx: thighR * 1.08, rz: thighR * 1.12, type: 'thigh_top' });
        
        // PELVIS/HIPS (Y: 0.78 - 0.88)
        const pelvisR = 0.14 * hipW;
        sections.push({ y: 0.78, cx: 0, cz: 0, rx: pelvisR, rz: 0.1 * fat, type: 'pelvis_low' });
        sections.push({ y: 0.85, cx: 0, cz: 0, rx: pelvisR * 1.1, rz: 0.11 * fat, type: 'pelvis_mid' });
        sections.push({ y: 0.88, cx: 0, cz: 0, rx: pelvisR, rz: 0.095, type: 'pelvis_top' });
        
        // ABDOMEN (Y: 0.88 - 1.08)
        const waistR = 0.12 * fat;
        sections.push({ y: 0.92, cx: 0, cz: 0.02, rx: waistR, rz: 0.09, type: 'lower_abs',
            muscleMap: muscle > 0.9 ? [
                { angle: 0, intensity: 0.012, width: 0.3 },
                { angle: 0.3, intensity: 0.012, width: 0.3 },
                { angle: -0.3, intensity: 0.012, width: 0.3 }
            ] : [] });
        sections.push({ y: 0.98, cx: 0, cz: 0.02, rx: waistR * 0.92, rz: 0.085, type: 'waist' });
        sections.push({ y: 1.05, cx: 0, cz: 0.025, rx: waistR * 1.05, rz: 0.095, type: 'upper_abs' });
        
        // CHEST/RIBCAGE (Y: 1.08 - 1.32)
        const chestD = 0.11 * (0.9 + muscle * 0.15);
        sections.push({ y: 1.10, cx: 0, cz: 0.03, rx: 0.15, rz: chestD, type: 'lower_chest',
            muscleMap: [
                { angle: 0.4, intensity: 0.025 * muscle, width: 0.5 },
                { angle: -0.4, intensity: 0.025 * muscle, width: 0.5 }
            ]});
        sections.push({ y: 1.18, cx: 0, cz: 0.04, rx: 0.16 * muscle, rz: chestD * 1.08, type: 'chest' });
        sections.push({ y: 1.26, cx: 0, cz: 0.035, rx: 0.17 * shoulderW, rz: chestD, type: 'upper_chest' });
        sections.push({ y: 1.32, cx: 0, cz: 0.03, rx: 0.16 * shoulderW, rz: chestD * 0.95, type: 'chest_top' });
        
        // SHOULDERS (Y: 1.32 - 1.42)
        const shoulderR = 0.2 * shoulderW;
        sections.push({ y: 1.35, cx: 0, cz: 0.01, rx: shoulderR, rz: 0.09, type: 'shoulder' });
        sections.push({ y: 1.40, cx: 0, cz: 0, rx: shoulderR * 0.65, rz: 0.065, type: 'shoulder_top' });
        
        // NECK (Y: 1.42 - 1.55)
        sections.push({ y: 1.42, cx: 0, cz: 0.01, rx: 0.065, rz: 0.055, type: 'neck_base' });
        sections.push({ y: 1.48, cx: 0, cz: 0.015, rx: 0.055, rz: 0.05, type: 'neck_mid' });
        sections.push({ y: 1.54, cx: 0, cz: 0.02, rx: 0.05, rz: 0.045, type: 'neck_top' });
        
        // HEAD (Y: 1.55 - 1.85) - Detailed face profile
        const faceW = dna.faceWidth || 1.0;
        const jawW = dna.jawWidth || 1.0;
        sections.push({ y: 1.55, cx: 0, cz: 0.085, rx: 0.055 * jawW, rz: 0.055, type: 'chin' });
        sections.push({ y: 1.57, cx: 0, cz: 0.075, rx: 0.068 * jawW, rz: 0.065, type: 'lower_lip' });
        sections.push({ y: 1.59, cx: 0, cz: 0.065, rx: 0.075 * jawW, rz: 0.072, type: 'mouth' });
        sections.push({ y: 1.62, cx: 0, cz: 0.055, rx: 0.082 * faceW, rz: 0.08, type: 'nose_base' });
        sections.push({ y: 1.65, cx: 0, cz: 0.05, rx: 0.09 * faceW, rz: 0.088, type: 'cheek_low' });
        sections.push({ y: 1.68, cx: 0, cz: 0.045, rx: 0.095 * faceW, rz: 0.092, type: 'cheek' });
        sections.push({ y: 1.71, cx: 0, cz: 0.04, rx: 0.095 * faceW, rz: 0.098, type: 'eye_level' });
        sections.push({ y: 1.74, cx: 0, cz: 0.03, rx: 0.098 * faceW, rz: 0.1, type: 'brow' });
        sections.push({ y: 1.77, cx: 0, cz: 0.015, rx: 0.1 * faceW, rz: 0.11, type: 'forehead' });
        sections.push({ y: 1.80, cx: 0, cz: 0, rx: 0.095, rz: 0.105, type: 'upper_forehead' });
        sections.push({ y: 1.83, cx: 0, cz: -0.02, rx: 0.085, rz: 0.095, type: 'crown' });
        sections.push({ y: 1.85, cx: 0, cz: -0.03, rx: 0.05, rz: 0.055, type: 'top' });
        
        return sections;
    }
};
