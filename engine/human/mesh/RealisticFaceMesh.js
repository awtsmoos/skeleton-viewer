// B"H
/**
 * RealisticFaceMesh: The Divine Countenance in Complete Detail
 * Creates detailed facial features - eyes, nose, mouth, ears
 * Designed to be added as detail geometry on top of the unified body mesh
 */

import { LoftEngine } from '../../geometry/LoftEngine.js';
import { Vec3 } from '../../math/Vec3.js';

export const RealisticFaceMesh = {
    /**
     * Generate all facial features
     * @param {Object} dna - DNA parameters
     * @returns {Array} Array of feature geometries
     */
    generateAll: (dna = {}) => {
        const features = [];
        
        // Eyes (complete with sockets, eyeballs, iris, pupil, eyelids)
        features.push(...RealisticFaceMesh.generateEyes(dna));
        
        // Nose (bridge, tip, nostrils)
        features.push(RealisticFaceMesh.generateNose(dna));
        
        // Mouth (lips, teeth visible, tongue)
        features.push(RealisticFaceMesh.generateMouth(dna));
        
        // Ears
        features.push(...RealisticFaceMesh.generateEars(dna));
        
        // Eyebrows
        features.push(...RealisticFaceMesh.generateEyebrows(dna));
        
        return features.filter(f => f && f.geometry);
    },

    /**
     * Generate complete eye system
     */
    generateEyes: (dna = {}) => {
        const parts = [];
        const eyeColor = dna.eyeColor || [0.4, 0.25, 0.12];
        const eyeSpacing = (dna.eyeSpacing || 1.0) * 0.036;
        const eyeY = 1.698;
        const eyeZ = 0.082;
        const eyeSize = 0.0125;
        
        [-1, 1].forEach(side => {
            const x = side * eyeSpacing;
            const sideName = side === -1 ? 'left' : 'right';
            
            // Eye socket (concave depression in skull)
            const socketGeo = RealisticFaceMesh.createEyeSocket(x, eyeY, eyeZ, side);
            parts.push({
                geometry: socketGeo,
                type: 'eye_socket',
                side: sideName,
                color: [0.75, 0.55, 0.48] // Skin shadow color
            });
            
            // Eyeball (sclera - white)
            const eyeballGeo = RealisticFaceMesh.createEyeball(x, eyeY, eyeZ, eyeSize);
            parts.push({
                geometry: eyeballGeo,
                type: 'eyeball',
                side: sideName,
                color: [0.98, 0.97, 0.96]
            });
            
            // Iris
            const irisGeo = RealisticFaceMesh.createIris(x, eyeY, eyeZ + eyeSize * 0.85, eyeSize * 0.48);
            parts.push({
                geometry: irisGeo,
                type: 'iris',
                side: sideName,
                color: eyeColor
            });
            
            // Pupil
            const pupilGeo = RealisticFaceMesh.createPupil(x, eyeY, eyeZ + eyeSize * 0.92, eyeSize * 0.2);
            parts.push({
                geometry: pupilGeo,
                type: 'pupil',
                side: sideName,
                color: [0.02, 0.02, 0.02]
            });
            
            // Cornea highlight (specular dome)
            const corneaGeo = RealisticFaceMesh.createCornea(x, eyeY, eyeZ + eyeSize * 0.95, eyeSize * 0.35);
            parts.push({
                geometry: corneaGeo,
                type: 'cornea',
                side: sideName,
                color: [1, 1, 1],
                transparent: true
            });
            
            // Upper eyelid
            const upperLidGeo = RealisticFaceMesh.createEyelid(x, eyeY, eyeZ, side, 'upper', dna);
            parts.push({
                geometry: upperLidGeo,
                type: 'eyelid_upper',
                side: sideName,
                color: dna.skinColor || [0.82, 0.62, 0.52]
            });
            
            // Lower eyelid
            const lowerLidGeo = RealisticFaceMesh.createEyelid(x, eyeY, eyeZ, side, 'lower', dna);
            parts.push({
                geometry: lowerLidGeo,
                type: 'eyelid_lower',
                side: sideName,
                color: dna.skinColor || [0.8, 0.6, 0.5]
            });
        });
        
        return parts;
    },

    createEyeSocket: (x, y, z, side) => {
        const points = [];
        const radii = [];
        const segs = 8;
        
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const angle = t * Math.PI * 0.4;
            const depth = Math.sin(angle) * 0.018;
            const r = 0.028 - t * 0.015;
            
            points.push({ x, y, z: z - depth });
            radii.push(r);
        }
        
        return LoftEngine.loftPath(points, radii, 14);
    },

    createEyeball: (x, y, z, radius) => {
        const points = [];
        const radii = [];
        const segs = 10;
        
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const angle = t * Math.PI;
            const zPos = z + Math.cos(angle) * radius;
            const r = Math.sin(angle) * radius;
            
            points.push({ x, y: y + Math.cos(angle) * radius * 0.15, z: zPos });
            radii.push(Math.max(0.001, r));
        }
        
        return LoftEngine.loftPath(points, radii, 18);
    },

    createIris: (x, y, z, radius) => {
        const points = [];
        const radii = [];
        
        for (let i = 0; i <= 6; i++) {
            const t = i / 6;
            points.push({ x, y, z: z + t * 0.003 });
            radii.push(radius * (1 - t * 0.15));
        }
        
        return LoftEngine.loftPath(points, radii, 20);
    },

    createPupil: (x, y, z, radius) => {
        const points = [];
        const radii = [];
        
        for (let i = 0; i <= 4; i++) {
            const t = i / 4;
            points.push({ x, y, z: z + t * 0.002 });
            radii.push(radius * (1 - t * 0.3));
        }
        
        return LoftEngine.loftPath(points, radii, 16);
    },

    createCornea: (x, y, z, radius) => {
        const points = [];
        const radii = [];
        
        for (let i = 0; i <= 5; i++) {
            const t = i / 5;
            const dome = Math.sin(t * Math.PI * 0.5);
            points.push({ x, y, z: z + dome * 0.004 });
            radii.push(radius * (1 - t * 0.5));
        }
        
        return LoftEngine.loftPath(points, radii, 14);
    },

    createEyelid: (x, y, z, side, type, dna = {}) => {
        const points = [];
        const radii = [];
        const segs = 12;
        const isUpper = type === 'upper';
        const yOffset = isUpper ? 0.012 : -0.01;
        const thickness = isUpper ? 0.005 : 0.004;
        const openAmount = dna.blinkState || 1.0; // 0 = closed, 1 = open
        
        for (let i = 0; i <= segs; i++) {
            const t = (i / segs) * 2 - 1; // -1 to 1
            const angle = t * Math.PI * 0.5;
            const xCurve = Math.sin(angle) * 0.018;
            const yCurve = Math.cos(angle) * 0.004 * (isUpper ? 1 : -1);
            
            // Lid curves over eye
            const yLid = y + yOffset + yCurve * openAmount;
            const zLid = z + 0.01 - Math.abs(t) * 0.008;
            
            points.push({
                x: x + xCurve,
                y: yLid,
                z: zLid
            });
            radii.push(thickness * (1 - Math.abs(t) * 0.3));
        }
        
        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Generate detailed nose
     */
    generateNose: (dna = {}) => {
        const noseSize = dna.noseSize || 1.0;
        const noseWidth = dna.noseWidth || 1.0;
        const bridgeHeight = dna.noseBridge || 1.0;
        
        const parts = [];
        
        // Nose bridge profile
        const bridgePts = [
            { x: 0, y: 1.72, z: 0.085 },        // Between eyes
            { x: 0, y: 1.695, z: 0.095 + bridgeHeight * 0.012 },  // Upper bridge
            { x: 0, y: 1.67, z: 0.105 + bridgeHeight * 0.015 },   // Mid bridge
            { x: 0, y: 1.645, z: 0.115 + bridgeHeight * 0.01 },   // Lower bridge
            { x: 0, y: 1.625, z: 0.122 * noseSize },              // Nose tip approach
            { x: 0, y: 1.615, z: 0.128 * noseSize },              // Nose tip
            { x: 0, y: 1.608, z: 0.118 * noseSize },              // Below tip
            { x: 0, y: 1.60, z: 0.105 }                           // Philtrum
        ];
        
        const bridgeRadii = [
            0.008,
            0.01 * noseSize,
            0.012 * noseSize,
            0.014 * noseSize,
            0.018 * noseSize * noseWidth,
            0.02 * noseSize * noseWidth,  // Tip is widest
            0.012 * noseWidth,
            0.006
        ];
        
        parts.push(LoftEngine.loftPath(bridgePts, bridgeRadii, 12));
        
        // Nostrils (left and right)
        [-1, 1].forEach(side => {
            const nostrilX = side * 0.012 * noseWidth;
            const nostrilPts = [
                { x: nostrilX, y: 1.615, z: 0.115 },
                { x: nostrilX * 1.2, y: 1.608, z: 0.108 },
                { x: nostrilX * 1.1, y: 1.602, z: 0.102 }
            ];
            const nostrilRadii = [0.006 * noseWidth, 0.008 * noseWidth, 0.005];
            parts.push(LoftEngine.loftPath(nostrilPts, nostrilRadii, 8));
        });
        
        // Nasal wings (alar cartilage)
        [-1, 1].forEach(side => {
            const wingX = side * 0.018 * noseWidth;
            const wingPts = [
                { x: wingX * 0.6, y: 1.62, z: 0.115 },
                { x: wingX, y: 1.612, z: 0.105 },
                { x: wingX * 0.8, y: 1.605, z: 0.098 }
            ];
            const wingRadii = [0.004, 0.006, 0.003];
            parts.push(LoftEngine.loftPath(wingPts, wingRadii, 6));
        });
        
        return {
            geometry: LoftEngine.weld(parts, 0.002),
            type: 'nose',
            color: dna.skinColor || [0.85, 0.65, 0.55]
        };
    },

    /**
     * Generate detailed mouth with lips
     */
    generateMouth: (dna = {}) => {
        const lipFullness = dna.lipFullness || 1.0;
        const mouthWidth = dna.mouthWidth || 1.0;
        const parts = [];
        
        const mouthY = 1.588;
        const mouthZ = 0.098;
        
        // Upper lip (cupid's bow)
        const upperLipPts = [];
        const upperLipRadii = [];
        const lipSegs = 16;
        
        for (let i = 0; i <= lipSegs; i++) {
            const t = (i / lipSegs) * 2 - 1; // -1 to 1
            const x = t * 0.028 * mouthWidth;
            
            // Cupid's bow shape
            const absT = Math.abs(t);
            const cupidDip = t === 0 ? 0.003 : (Math.cos(t * Math.PI * 2) * 0.002);
            const yBow = mouthY + 0.007 * lipFullness + cupidDip;
            const zBow = mouthZ + 0.015 * lipFullness - absT * 0.012;
            
            upperLipPts.push({ x, y: yBow, z: zBow });
            upperLipRadii.push((0.005 - absT * 0.002) * lipFullness);
        }
        parts.push(LoftEngine.loftPath(upperLipPts, upperLipRadii, 8));
        
        // Lower lip (fuller, rounder)
        const lowerLipPts = [];
        const lowerLipRadii = [];
        
        for (let i = 0; i <= lipSegs; i++) {
            const t = (i / lipSegs) * 2 - 1;
            const x = t * 0.026 * mouthWidth;
            const absT = Math.abs(t);
            
            // Lower lip fuller in center
            const fullness = Math.cos(t * Math.PI * 0.5);
            const yLip = mouthY - 0.006 * lipFullness;
            const zLip = mouthZ + 0.018 * lipFullness * fullness - absT * 0.015;
            
            lowerLipPts.push({ x, y: yLip, z: zLip });
            lowerLipRadii.push((0.006 - absT * 0.003) * lipFullness);
        }
        parts.push(LoftEngine.loftPath(lowerLipPts, lowerLipRadii, 8));
        
        // Mouth corners
        [-1, 1].forEach(side => {
            const cornerPts = [
                { x: side * 0.028 * mouthWidth, y: mouthY + 0.002, z: mouthZ + 0.002 },
                { x: side * 0.032 * mouthWidth, y: mouthY, z: mouthZ - 0.002 }
            ];
            parts.push(LoftEngine.loftPath(cornerPts, [0.003, 0.002], 6));
        });
        
        return {
            geometry: LoftEngine.weld(parts, 0.002),
            type: 'mouth',
            color: [0.72, 0.42, 0.42] // Lip color
        };
    },

    /**
     * Generate detailed ears
     */
    generateEars: (dna = {}) => {
        const parts = [];
        const earSize = dna.earSize || 1.0;
        
        [-1, 1].forEach(side => {
            const sideName = side === -1 ? 'left' : 'right';
            const x = side * 0.102;
            const earY = 1.68;
            const earZ = -0.005;
            
            // Helix (outer rim)
            const helixPts = [];
            const helixRadii = [];
            const helixSegs = 20;
            
            for (let i = 0; i <= helixSegs; i++) {
                const t = i / helixSegs;
                const angle = t * Math.PI * 1.3 - Math.PI * 0.15;
                const r = 0.028 * earSize;
                
                helixPts.push({
                    x: x + side * (0.008 + Math.cos(angle) * 0.005),
                    y: earY + Math.sin(angle) * r,
                    z: earZ + Math.cos(angle) * r * 0.3
                });
                helixRadii.push(0.004 * (1 - t * 0.4));
            }
            
            const helixGeo = LoftEngine.loftPath(helixPts, helixRadii, 8);
            
            // Antihelix (inner ridge)
            const antihelixPts = [];
            const antihelixRadii = [];
            
            for (let i = 0; i <= 12; i++) {
                const t = i / 12;
                const angle = t * Math.PI * 0.9;
                
                antihelixPts.push({
                    x: x + side * 0.005,
                    y: earY - 0.005 + Math.sin(angle) * 0.018 * earSize,
                    z: earZ + 0.008 + Math.cos(angle) * 0.005
                });
                antihelixRadii.push(0.003);
            }
            
            const antihelixGeo = LoftEngine.loftPath(antihelixPts, antihelixRadii, 6);
            
            // Tragus (front flap)
            const tragusPts = [
                { x: x + side * 0.002, y: earY - 0.008, z: earZ + 0.012 },
                { x: x + side * 0.003, y: earY - 0.015, z: earZ + 0.008 }
            ];
            const tragusGeo = LoftEngine.loftPath(tragusPts, [0.005, 0.003], 6);
            
            // Earlobe
            const lobePts = [];
            const lobeRadii = [];
            
            for (let i = 0; i <= 8; i++) {
                const t = i / 8;
                lobePts.push({
                    x: x + side * (0.006 - t * 0.002),
                    y: earY - 0.03 - t * 0.012 * earSize,
                    z: earZ + 0.005 + Math.sin(t * Math.PI) * 0.004
                });
                lobeRadii.push(0.008 * earSize * (1 - t * 0.3));
            }
            
            const lobeGeo = LoftEngine.loftPath(lobePts, lobeRadii, 8);
            
            // Combine ear parts
            const earGeo = LoftEngine.weld([helixGeo, antihelixGeo, tragusGeo, lobeGeo], 0.002);
            
            parts.push({
                geometry: earGeo,
                type: 'ear',
                side: sideName,
                color: dna.skinColor || [0.82, 0.62, 0.52]
            });
        });
        
        return parts;
    },

    /**
     * Generate eyebrows
     */
    generateEyebrows: (dna = {}) => {
        const parts = [];
        const browColor = dna.hairColor || [0.18, 0.12, 0.08];
        const browThickness = dna.browThickness || 1.0;
        
        [-1, 1].forEach(side => {
            const sideName = side === -1 ? 'left' : 'right';
            const eyeSpacing = (dna.eyeSpacing || 1.0) * 0.036;
            const x = side * eyeSpacing;
            const browY = 1.725;
            const browZ = 0.088;
            
            const browPts = [];
            const browRadii = [];
            const browSegs = 14;
            
            for (let i = 0; i <= browSegs; i++) {
                const t = i / browSegs;
                const curve = Math.sin(t * Math.PI);
                const xPos = x + (t - 0.3) * 0.035 * side;
                const yPos = browY + curve * 0.006 - t * 0.008;
                const zPos = browZ - t * 0.012;
                
                browPts.push({ x: xPos, y: yPos, z: zPos });
                browRadii.push((0.003 + curve * 0.003) * browThickness);
            }
            
            parts.push({
                geometry: LoftEngine.loftPath(browPts, browRadii, 6),
                type: 'eyebrow',
                side: sideName,
                color: browColor
            });
        });
        
        return parts;
    }
};
