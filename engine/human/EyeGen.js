// B"H
/**
 * EyeGen: The Divine Windows of the Soul
 * Generates hyper-realistic eyeball geometry with iris, pupil, and sclera
 */

import { LoftEngine } from '../geometry/LoftEngine.js';
import { Vec3 } from '../math/Vec3.js';
import { Primitives } from '../generators/Primitives.js';
import { GeoUtils } from '../generators/GeoUtils.js';

export const EyeGen = {
    /**
     * Generate complete eyeball with all layers
     */
    createEyeball: (side, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const cx = 0.035 * mult;
        const cy = 1.7;
        const cz = 0.085;
        const eyeRadius = 0.012;

        const parts = [];

        // 1. Sclera (white of the eye) - main sphere
        const sclera = EyeGen.createSclera(cx, cy, cz, eyeRadius);
        parts.push(sclera);

        // 2. Cornea (transparent dome over iris) - slight bulge
        const cornea = EyeGen.createCornea(cx, cy, cz + eyeRadius * 0.8, eyeRadius * 0.4);
        parts.push(cornea);

        // 3. Iris (colored ring)
        const irisColor = dna?.eyeColor || [0.35, 0.25, 0.1];
        const iris = EyeGen.createIris(cx, cy, cz + eyeRadius * 0.9, 0.006, irisColor);
        parts.push(iris);

        // 4. Pupil (black center)
        const pupil = EyeGen.createPupil(cx, cy, cz + eyeRadius * 0.95, 0.003);
        parts.push(pupil);

        return GeoUtils.merge(parts);
    },

    /**
     * Create sclera (white of eye)
     */
    createSclera: (cx, cy, cz, radius) => {
        const sphere = Primitives.createSphere(16, 16);
        return GeoUtils.transform(sphere, cx, cy, cz, radius, radius, radius);
    },

    /**
     * Create cornea (transparent dome)
     */
    createCornea: (cx, cy, cz, radius) => {
        // Partial sphere for cornea bulge
        const points = [];
        const radii = [];
        const segs = 8;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const angle = t * Math.PI * 0.3; // Only front portion
            points.push({
                x: cx,
                y: cy,
                z: cz + Math.cos(angle) * radius * 0.5
            });
            radii.push(Math.sin(angle) * radius + 0.001);
        }

        return LoftEngine.loftPath(points, radii, 12);
    },

    /**
     * Create iris (colored ring)
     */
    createIris: (cx, cy, cz, radius, color) => {
        // Flat disc for iris
        const disc = Primitives.createSphere(8, 8);
        return GeoUtils.transform(disc, cx, cy, cz, radius, radius, 0.001);
    },

    /**
     * Create pupil (black center)
     */
    createPupil: (cx, cy, cz, radius) => {
        const disc = Primitives.createSphere(6, 6);
        return GeoUtils.transform(disc, cx, cy, cz, radius, radius, 0.0005);
    },

    /**
     * Create upper eyelid geometry
     */
    createUpperEyelid: (side, openAmount = 1.0, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const cx = 0.035 * mult;
        const cy = 1.7;
        const cz = 0.09;

        // Eyelid as curved surface
        const points = [];
        const radii = [];
        const segs = 6;
        const lidHeight = 0.015;
        const closedOffset = (1 - openAmount) * lidHeight;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const x = cx + (t - 0.5) * 0.025 * mult;
            const y = cy + 0.012 - closedOffset;
            const z = cz + Math.sin(t * Math.PI) * 0.005;
            points.push({ x, y, z });
            radii.push(0.003 + Math.sin(t * Math.PI) * 0.002);
        }

        return LoftEngine.loftPath(points, radii, 8);
    },

    /**
     * Create lower eyelid geometry
     */
    createLowerEyelid: (side, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const cx = 0.035 * mult;
        const cy = 1.7 - 0.01;
        const cz = 0.088;

        const points = [];
        const radii = [];
        const segs = 6;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const x = cx + (t - 0.5) * 0.022 * mult;
            const y = cy;
            const z = cz + Math.sin(t * Math.PI) * 0.003;
            points.push({ x, y, z });
            radii.push(0.002 + Math.sin(t * Math.PI) * 0.001);
        }

        return LoftEngine.loftPath(points, radii, 6);
    },

    /**
     * Create eyebrow geometry
     */
    createEyebrow: (side, raised = 0, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const baseY = 1.73 + raised * 0.01;
        const cx = 0.035 * mult;

        const points = [];
        const radii = [];
        const segs = 8;

        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            // Eyebrow curves from inner to outer
            const x = cx + (t - 0.3) * 0.04 * mult;
            const y = baseY + Math.sin(t * Math.PI) * 0.005;
            const z = 0.095 - t * 0.008;
            points.push({ x, y, z });
            // Thicker in middle, thinner at ends
            radii.push(0.002 + Math.sin(t * Math.PI) * 0.002);
        }

        return LoftEngine.loftPath(points, radii, 6);
    },

    /**
     * Create complete eye assembly with eyelids and eyebrows
     */
    createCompleteEye: (side, state = {}, dna = null) => {
        const parts = [];

        // Eyeball
        parts.push(EyeGen.createEyeball(side, dna));

        // Upper eyelid
        const openAmount = state.eyelidOpen ?? 1.0;
        parts.push(EyeGen.createUpperEyelid(side, openAmount, dna));

        // Lower eyelid
        parts.push(EyeGen.createLowerEyelid(side, dna));

        // Eyebrow
        const browRaised = state.browRaised ?? 0;
        parts.push(EyeGen.createEyebrow(side, browRaised, dna));

        return GeoUtils.merge(parts);
    }
};
