// B"H
/**
 * EarGen: The Divine Auditory Forms
 * Generates anatomically accurate ear geometry
 */

import { LoftEngine } from '../geometry/LoftEngine.js';
import { Primitives } from '../generators/Primitives.js';
import { GeoUtils } from '../generators/GeoUtils.js';

export const EarGen = {
    /**
     * Create complete ear geometry
     */
    createEar: (side, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const baseX = 0.1 * mult;
        const baseY = 1.67;
        const baseZ = -0.01;

        const parts = [];

        // 1. Helix (outer rim)
        parts.push(EarGen.createHelix(side, dna));

        // 2. Antihelix (Y-shaped inner ridge)
        parts.push(EarGen.createAntihelix(side, dna));

        // 3. Concha (bowl)
        parts.push(EarGen.createConcha(side, dna));

        // 4. Tragus (small flap in front of ear canal)
        parts.push(EarGen.createTragus(side, dna));

        // 5. Lobe
        parts.push(EarGen.createLobe(side, dna));

        return GeoUtils.merge(parts);
    },

    /**
     * Create helix (outer rim of ear)
     */
    createHelix: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        const points = [];
        const radii = [];
        const segs = 16;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            // Ear rim follows C-shape
            const angle = (0.7 - t * 1.4) * Math.PI;
            const r = 0.017 + Math.sin(t * Math.PI) * 0.005;

            const x = 0.1 * mult + Math.cos(angle) * 0.005 * mult;
            const y = 1.67 + Math.sin(angle) * r;
            const z = -0.01 + Math.cos(angle) * r * 0.3;

            points.push({ x, y, z });
            radii.push(0.003 - t * 0.001);
        }

        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Create antihelix (inner ridge)
     */
    createAntihelix: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        const points = [];
        const radii = [];
        const segs = 10;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const angle = (0.4 - t * 0.8) * Math.PI;

            const x = 0.097 * mult;
            const y = 1.68 + Math.sin(angle) * 0.012;
            const z = -0.005 + Math.cos(angle) * 0.006;

            points.push({ x, y, z });
            radii.push(0.002);
        }

        return LoftEngine.loftPath(points, radii, 6);
    },

    /**
     * Create concha (bowl of ear)
     */
    createConcha: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        
        // Simple indented bowl shape
        return GeoUtils.transform(
            Primitives.createSphere(8, 8),
            0.095 * mult, 1.665, 0.003,
            0.008, 0.01, 0.006
        );
    },

    /**
     * Create tragus (small flap)
     */
    createTragus: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        
        return GeoUtils.transform(
            Primitives.createSphere(4, 4),
            0.092 * mult, 1.665, 0.01,
            0.004, 0.006, 0.003
        );
    },

    /**
     * Create ear lobe
     */
    createLobe: (side, dna) => {
        const mult = side === 'left' ? -1 : 1;
        
        const points = [
            { x: 0.098 * mult, y: 1.655, z: 0 },
            { x: 0.1 * mult, y: 1.645, z: 0.002 },
            { x: 0.098 * mult, y: 1.635, z: 0 }
        ];
        const radii = [0.003, 0.005, 0.003];

        return LoftEngine.loftPath(points, radii, 8);
    }
};
