// B"H
/**
 * MouthGen: The Divine Gateway of Speech
 * Generates hyper-realistic mouth geometry with lips, teeth, and jaw
 */

import { LoftEngine } from '../geometry/LoftEngine.js';
import { Vec3 } from '../math/Vec3.js';
import { Primitives } from '../generators/Primitives.js';
import { GeoUtils } from '../generators/GeoUtils.js';

export const MouthGen = {
    /**
     * Generate complete mouth assembly
     */
    createMouth: (state = {}, dna = null) => {
        const parts = [];

        const openAmount = state.mouthOpen ?? 0;
        const smileAmount = state.smile ?? 0;
        const lipFullness = dna?.lipFullness ?? 1.0;

        // 1. Upper lip
        parts.push(MouthGen.createUpperLip(smileAmount, lipFullness));

        // 2. Lower lip
        parts.push(MouthGen.createLowerLip(openAmount, smileAmount, lipFullness));

        // 3. Teeth (visible when mouth open)
        if (openAmount > 0.1) {
            parts.push(MouthGen.createTeeth('upper'));
            parts.push(MouthGen.createTeeth('lower', openAmount));
        }

        // 4. Tongue (visible when mouth open)
        if (openAmount > 0.3) {
            parts.push(MouthGen.createTongue(openAmount));
        }

        return GeoUtils.merge(parts);
    },

    /**
     * Create upper lip geometry
     */
    createUpperLip: (smileAmount = 0, fullness = 1.0) => {
        const points = [];
        const radii = [];
        const segs = 12;
        const baseY = 1.58;
        const baseZ = 0.11;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const angle = (t - 0.5) * Math.PI;
            
            // Cupid's bow shape
            const cupidBow = Math.cos(angle * 2) * 0.003;
            
            // Smile lifts corners
            const smileLift = Math.abs(t - 0.5) * 2 * smileAmount * 0.005;
            
            const x = Math.sin(angle) * 0.025;
            const y = baseY + cupidBow + smileLift;
            const z = baseZ + Math.cos(angle) * 0.008;
            
            points.push({ x, y, z });
            // Lip thickness varies - fuller in center
            const centerFullness = 1 - Math.abs(t - 0.5) * 1.5;
            radii.push(0.003 * fullness * (0.5 + centerFullness * 0.5));
        }

        return LoftEngine.loftPath(points, radii, 10);
    },

    /**
     * Create lower lip geometry
     */
    createLowerLip: (openAmount = 0, smileAmount = 0, fullness = 1.0) => {
        const points = [];
        const radii = [];
        const segs = 10;
        const baseY = 1.565 - openAmount * 0.02;
        const baseZ = 0.108;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const angle = (t - 0.5) * Math.PI * 0.9;
            
            // Smile pulls corners
            const smilePull = Math.abs(t - 0.5) * 2 * smileAmount * 0.003;
            
            const x = Math.sin(angle) * 0.022;
            const y = baseY + smilePull;
            const z = baseZ + Math.cos(angle) * 0.006;
            
            points.push({ x, y, z });
            // Lower lip generally fuller than upper
            const centerFullness = 1 - Math.abs(t - 0.5) * 1.2;
            radii.push(0.004 * fullness * (0.6 + centerFullness * 0.4));
        }

        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Create teeth row
     */
    createTeeth: (row, openAmount = 0) => {
        const parts = [];
        const isUpper = row === 'upper';
        const baseY = isUpper ? 1.56 : 1.54 - openAmount * 0.015;
        const baseZ = 0.095;

        // Simplified: 8 front teeth visible
        const teethData = [
            { x: 0, w: 0.006, type: 'central' },
            { x: 0.007, w: 0.005, type: 'lateral' },
            { x: -0.007, w: 0.005, type: 'lateral' },
            { x: 0.013, w: 0.005, type: 'canine' },
            { x: -0.013, w: 0.005, type: 'canine' },
            { x: 0.019, w: 0.005, type: 'premolar' },
            { x: -0.019, w: 0.005, type: 'premolar' }
        ];

        teethData.forEach(tooth => {
            const h = isUpper ? 0.01 : 0.009;
            const toothGeo = GeoUtils.transform(
                Primitives.createCube(),
                tooth.x, baseY, baseZ,
                tooth.w / 2, h / 2, 0.003
            );
            parts.push(toothGeo);
        });

        return GeoUtils.merge(parts);
    },

    /**
     * Create tongue geometry
     */
    createTongue: (protrusion = 0) => {
        const baseY = 1.545;
        const baseZ = 0.06 + protrusion * 0.02;

        const points = [
            { x: 0, y: baseY, z: baseZ },
            { x: 0, y: baseY, z: baseZ + 0.015 },
            { x: 0, y: baseY, z: baseZ + 0.03 },
            { x: 0, y: baseY + 0.002, z: baseZ + 0.04 }
        ];

        const radii = [0.012, 0.014, 0.012, 0.006];

        return LoftEngine.loftPath(points, radii, 10);
    },

    /**
     * Create mouth corners (commissures)
     */
    createMouthCorners: (smileAmount = 0) => {
        const parts = [];
        
        [-1, 1].forEach(side => {
            const x = 0.025 * side;
            const y = 1.575 + smileAmount * 0.005;
            const z = 0.1 - smileAmount * 0.005;

            const corner = GeoUtils.transform(
                Primitives.createSphere(4, 4),
                x, y, z,
                0.004, 0.006, 0.003
            );
            parts.push(corner);
        });

        return GeoUtils.merge(parts);
    }
};
