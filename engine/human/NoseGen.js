// B"H
/**
 * NoseGen: The Divine Organ of Breath
 * Generates anatomically accurate nose geometry
 */

import { LoftEngine } from '../geometry/LoftEngine.js';
import { Primitives } from '../generators/Primitives.js';
import { GeoUtils } from '../generators/GeoUtils.js';

export const NoseGen = {
    /**
     * Create complete nose geometry
     */
    createNose: (dna = null) => {
        const parts = [];
        const noseSize = dna?.noseSize || 1.0;
        const noseWidth = dna?.noseWidth || 1.0;

        // 1. Bridge
        parts.push(NoseGen.createBridge(noseSize));

        // 2. Tip
        parts.push(NoseGen.createTip(noseSize, noseWidth));

        // 3. Alae (wings/nostrils)
        parts.push(NoseGen.createAla('left', noseWidth));
        parts.push(NoseGen.createAla('right', noseWidth));

        // 4. Septum
        parts.push(NoseGen.createSeptum(noseSize));

        return GeoUtils.merge(parts);
    },

    /**
     * Create nose bridge
     */
    createBridge: (sizeScale = 1.0) => {
        const points = [
            { x: 0, y: 1.72, z: 0.085 },    // Nasion (between eyes)
            { x: 0, y: 1.68, z: 0.1 },      // Upper bridge
            { x: 0, y: 1.64, z: 0.115 },    // Mid bridge
            { x: 0, y: 1.62, z: 0.12 }      // Approaching tip
        ];

        const radii = [
            0.012 * sizeScale,
            0.013 * sizeScale,
            0.014 * sizeScale,
            0.016 * sizeScale
        ];

        return LoftEngine.loftPath(points, radii, 10);
    },

    /**
     * Create nose tip
     */
    createTip: (sizeScale = 1.0, widthScale = 1.0) => {
        // Rounded tip
        return GeoUtils.transform(
            Primitives.createSphere(10, 10),
            0, 1.62, 0.12,
            0.015 * widthScale * sizeScale,
            0.012 * sizeScale,
            0.015 * sizeScale
        );
    },

    /**
     * Create ala (nostril wing)
     */
    createAla: (side, widthScale = 1.0) => {
        const mult = side === 'left' ? -1 : 1;
        const x = 0.012 * mult * widthScale;

        // Nostril wing shape
        const points = [
            { x: x * 0.5, y: 1.615, z: 0.11 },
            { x: x, y: 1.612, z: 0.105 },
            { x: x * 0.8, y: 1.605, z: 0.1 }
        ];

        const radii = [0.008, 0.01, 0.006];

        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Create septum (divider between nostrils)
     */
    createSeptum: (sizeScale = 1.0) => {
        return GeoUtils.transform(
            Primitives.createCube(),
            0, 1.608, 0.105,
            0.003 * sizeScale, 0.006 * sizeScale, 0.008 * sizeScale
        );
    },

    /**
     * Create nostril openings (for visual depth)
     */
    createNostrils: () => {
        const parts = [];

        [-1, 1].forEach(mult => {
            const x = 0.008 * mult;
            const nostril = GeoUtils.transform(
                Primitives.createSphere(4, 4),
                x, 1.605, 0.1,
                0.004, 0.003, 0.006
            );
            parts.push(nostril);
        });

        return GeoUtils.merge(parts);
    }
};
