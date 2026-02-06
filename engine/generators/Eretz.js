// B"H
import { Primitives } from './Primitives.js';

/**
 * Eretz: The Foundation of Life.
 * Sculpts the earth into rolling hills using divine points of pressure.
 */
export const Eretz = {
    hills: [
        { x: 0.1, z: 0.2, h: 5.5, r: 0.6 },
        { x: -0.3, z: -0.1, h: 4.8, r: 0.7 },
        { x: 0.5, z: -0.5, h: 3.2, r: 0.5 },
        { x: -0.6, z: 0.6, h: 4.0, r: 0.8 }
    ],

    /**
     * Calculates the height of the terrain at any normalized UV coordinate.
     */
    getHeight: (px, pz) => {
        let y = 0;
        Eretz.hills.forEach(h => {
            const d2 = (px - h.x)**2 + (pz - h.z)**2;
            y += h.h * Math.exp(-d2 / (h.r**2));
        });
        return y;
    },

    generate: () => {
        return Primitives.createPlane(128, Eretz.getHeight);
    }
};