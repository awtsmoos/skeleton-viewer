// B"H
/**
 * FaceMeshGen: The Divine Countenance - Detailed Face Feature Generation
 * Creates eyes, eyeballs, eye sockets, eyelids, nose, lips, ears as mesh details
 */
import { Vec3 } from '../../math/Vec3.js';
import { LoftEngine } from '../../geometry/LoftEngine.js';

export const FaceMeshGen = {
    /**
     * Generate all facial features as separate geometry parts
     * @param {Object} dna - DNA parameters for face proportions
     * @returns {Array} Array of geometry objects
     */
    generateAll: (dna = {}) => {
        const parts = [];
        
        // Eyes (with sockets, eyeballs, irises)
        parts.push(...FaceMeshGen.generateEyes(dna));
        
        // Eyelids
        parts.push(...FaceMeshGen.generateEyelids(dna));
        
        // Eyebrows
        parts.push(...FaceMeshGen.generateEyebrows(dna));
        
        // Nose
        parts.push(FaceMeshGen.generateNose(dna));
        
        // Lips/Mouth
        parts.push(FaceMeshGen.generateMouth(dna));
        
        // Ears
        parts.push(...FaceMeshGen.generateEars(dna));
        
        return parts;
    },

    /**
     * Generate eyes with detailed structure
     */
    generateEyes: (dna) => {
        const parts = [];
        const eyeColor = dna.eyeColor || [0.4, 0.25, 0.1];
        const eyeSpacing = (dna.eyeSpacing || 1.0) * 0.035;
        const eyeY = 1.70;
        const eyeZ = 0.085;
        
        [-1, 1].forEach(side => {
            const x = side * eyeSpacing;
            
            // Eye socket (concave depression) - represented as inverted hemisphere
            const socketPts = [];
            const socketRadii = [];
            const socketSegs = 6;
            for (let i = 0; i <= socketSegs; i++) {
                const t = i / socketSegs;
                const angle = t * Math.PI * 0.5;
                const depth = Math.sin(angle) * 0.015;
                const r = Math.cos(angle) * 0.025;
                socketPts.push({ x: x, y: eyeY, z: eyeZ - depth });
                socketRadii.push(r);
            }
            parts.push({
                geo: LoftEngine.loftPath(socketPts, socketRadii, 12),
                type: 'eye_socket',
                side: side
            });
            
            // Eyeball (white sclera)
            const eyeballPts = [];
            const eyeballRadii = [];
            const eyeR = 0.0115;
            for (let i = 0; i <= 8; i++) {
                const t = i / 8;
                const angle = t * Math.PI;
                eyeballPts.push({
                    x: x,
                    y: eyeY + Math.cos(angle) * eyeR * 0.3,
                    z: eyeZ + Math.sin(angle) * eyeR
                });
                eyeballRadii.push(Math.sin(angle) * eyeR);
            }
            parts.push({
                geo: LoftEngine.loftPath(eyeballPts, eyeballRadii, 16),
                type: 'eyeball',
                color: [0.98, 0.98, 0.98],
                side: side
            });
            
            // Iris (colored part)
            const irisR = 0.006;
            const irisPts = [];
            const irisRadii = [];
            for (let i = 0; i <= 4; i++) {
                const t = i / 4;
                irisPts.push({ x: x, y: eyeY, z: eyeZ + 0.011 + t * 0.002 });
                irisRadii.push(irisR * (1 - t * 0.3));
            }
            parts.push({
                geo: LoftEngine.loftPath(irisPts, irisRadii, 16),
                type: 'iris',
                color: eyeColor,
                side: side
            });
            
            // Pupil (black)
            const pupilPts = [];
            const pupilRadii = [];
            for (let i = 0; i <= 3; i++) {
                const t = i / 3;
                pupilPts.push({ x: x, y: eyeY, z: eyeZ + 0.013 + t * 0.001 });
                pupilRadii.push(0.003 * (1 - t * 0.5));
            }
            parts.push({
                geo: LoftEngine.loftPath(pupilPts, pupilRadii, 12),
                type: 'pupil',
                color: [0.02, 0.02, 0.02],
                side: side
            });
        });
        
        return parts;
    },

    /**
     * Generate eyelids
     */
    generateEyelids: (dna) => {
        const parts = [];
        const eyeSpacing = (dna.eyeSpacing || 1.0) * 0.035;
        const eyeY = 1.70;
        const eyeZ = 0.085;
        
        [-1, 1].forEach(side => {
            const x = side * eyeSpacing;
            
            // Upper eyelid (curved crescent)
            const upperPts = [];
            const upperRadii = [];
            const upperSegs = 8;
            for (let i = 0; i <= upperSegs; i++) {
                const t = i / upperSegs;
                const angle = (t - 0.5) * Math.PI;
                upperPts.push({
                    x: x + Math.sin(angle) * 0.015,
                    y: eyeY + 0.01 + Math.cos(angle) * 0.003,
                    z: eyeZ + 0.008
                });
                upperRadii.push(0.004);
            }
            parts.push({
                geo: LoftEngine.loftPath(upperPts, upperRadii, 8),
                type: 'eyelid_upper',
                side: side
            });
            
            // Lower eyelid (smaller crescent)
            const lowerPts = [];
            const lowerRadii = [];
            for (let i = 0; i <= upperSegs; i++) {
                const t = i / upperSegs;
                const angle = (t - 0.5) * Math.PI;
                lowerPts.push({
                    x: x + Math.sin(angle) * 0.013,
                    y: eyeY - 0.008 + Math.cos(angle) * 0.002,
                    z: eyeZ + 0.007
                });
                lowerRadii.push(0.003);
            }
            parts.push({
                geo: LoftEngine.loftPath(lowerPts, lowerRadii, 8),
                type: 'eyelid_lower',
                side: side
            });
        });
        
        return parts;
    },

    /**
     * Generate eyebrows
     */
    generateEyebrows: (dna) => {
        const parts = [];
        const eyeSpacing = (dna.eyeSpacing || 1.0) * 0.035;
        const browY = 1.73;
        const browZ = 0.095;
        
        [-1, 1].forEach(side => {
            const x = side * eyeSpacing;
            
            // Eyebrow as curved ridge
            const browPts = [];
            const browRadii = [];
            const browSegs = 10;
            for (let i = 0; i <= browSegs; i++) {
                const t = i / browSegs;
                const curve = Math.sin(t * Math.PI);
                browPts.push({
                    x: x + (t - 0.5) * 0.03 * side,
                    y: browY + curve * 0.008 - t * 0.005,
                    z: browZ - t * 0.01
                });
                // Thicker in middle, thinner at ends
                browRadii.push(0.003 + curve * 0.002);
            }
            parts.push({
                geo: LoftEngine.loftPath(browPts, browRadii, 6),
                type: 'eyebrow',
                color: dna.hairColor || [0.15, 0.1, 0.05],
                side: side
            });
        });
        
        return parts;
    },

    /**
     * Generate detailed nose
     */
    generateNose: (dna) => {
        const noseSize = dna.noseSize || 1.0;
        const nosePts = [];
        const noseRadii = [];
        
        // Nose bridge to tip profile
        const profile = [
            { y: 1.72, z: 0.095, r: 0.008 },   // Bridge top
            { y: 1.69, z: 0.105, r: 0.009 },   // Bridge mid
            { y: 1.66, z: 0.11, r: 0.01 },     // Bridge low
            { y: 1.64, z: 0.115, r: 0.012 },   // Nose tip approach
            { y: 1.62, z: 0.12, r: 0.015 },    // Nose tip
            { y: 1.61, z: 0.115, r: 0.012 },   // Below tip
            { y: 1.605, z: 0.105, r: 0.008 }   // Nostril area
        ];
        
        profile.forEach(p => {
            nosePts.push({ x: 0, y: p.y, z: p.z });
            noseRadii.push(p.r * noseSize);
        });
        
        return {
            geo: LoftEngine.loftPath(nosePts, noseRadii, 10),
            type: 'nose'
        };
    },

    /**
     * Generate lips and mouth detail
     */
    generateMouth: (dna) => {
        const lipFullness = dna.lipFullness || 1.0;
        const mouthY = 1.575;
        const mouthZ = 0.11;
        
        const parts = [];
        
        // Upper lip (cupid's bow shape)
        const upperLipPts = [];
        const upperLipRadii = [];
        const lipSegs = 12;
        for (let i = 0; i <= lipSegs; i++) {
            const t = (i / lipSegs) * 2 - 1; // -1 to 1
            const x = t * 0.025;
            // Cupid's bow: dips in center, peaks at sides
            const cupid = Math.cos(t * Math.PI * 2) * 0.003;
            upperLipPts.push({
                x: x,
                y: mouthY + 0.008 + cupid,
                z: mouthZ + 0.005 - Math.abs(t) * 0.01
            });
            upperLipRadii.push((0.005 - Math.abs(t) * 0.002) * lipFullness);
        }
        parts.push({
            geo: LoftEngine.loftPath(upperLipPts, upperLipRadii, 8),
            type: 'lip_upper',
            color: [0.75, 0.45, 0.45]
        });
        
        // Lower lip (fuller, rounder)
        const lowerLipPts = [];
        const lowerLipRadii = [];
        for (let i = 0; i <= lipSegs; i++) {
            const t = (i / lipSegs) * 2 - 1; // -1 to 1
            const x = t * 0.023;
            lowerLipPts.push({
                x: x,
                y: mouthY - 0.005,
                z: mouthZ + 0.008 - Math.abs(t) * 0.012
            });
            lowerLipRadii.push((0.006 - Math.abs(t) * 0.003) * lipFullness);
        }
        parts.push({
            geo: LoftEngine.loftPath(lowerLipPts, lowerLipRadii, 8),
            type: 'lip_lower',
            color: [0.7, 0.4, 0.42]
        });
        
        return { parts, type: 'mouth' };
    },

    /**
     * Generate ears
     */
    generateEars: (dna) => {
        const parts = [];
        const earY = 1.67;
        const earZ = -0.01;
        
        [-1, 1].forEach(side => {
            const x = side * 0.1;
            
            // Outer ear (helix) as curved loft
            const helixPts = [];
            const helixRadii = [];
            const earSegs = 16;
            for (let i = 0; i <= earSegs; i++) {
                const t = i / earSegs;
                // C-shaped curve for ear
                const angle = t * Math.PI * 1.2 - Math.PI * 0.1;
                helixPts.push({
                    x: x + side * 0.012,
                    y: earY + Math.sin(angle) * 0.025,
                    z: earZ + Math.cos(angle) * 0.01
                });
                helixRadii.push(0.004 - t * 0.002);
            }
            parts.push({
                geo: LoftEngine.loftPath(helixPts, helixRadii, 8),
                type: 'ear_helix',
                side: side
            });
            
            // Earlobe
            const lobePts = [];
            const lobeRadii = [];
            for (let i = 0; i <= 5; i++) {
                const t = i / 5;
                lobePts.push({
                    x: x + side * 0.008,
                    y: earY - 0.03 - t * 0.01,
                    z: earZ + 0.005
                });
                lobeRadii.push(0.006 - t * 0.003);
            }
            parts.push({
                geo: LoftEngine.loftPath(lobePts, lobeRadii, 8),
                type: 'ear_lobe',
                side: side
            });
        });
        
        return parts;
    }
};
