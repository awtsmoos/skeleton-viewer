// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const ArmorGen = {
    createChainmailPatch: () => {
        const geos = [];
        // Torus links approximated by hollow squares (4 small cubes)
        const linkSize = 0.1;
        for(let x=0; x<5; x++) {
            for(let y=0; y<5; y++) {
                const ox = x * 0.15;
                const oy = y * 0.15;
                // Ring
                const thick = 0.02;
                geos.push(GeoUtils.transform(Primitives.createCube(), ox, oy+0.05, 0, thick, 0.05, thick)); // L
                geos.push(GeoUtils.transform(Primitives.createCube(), ox+0.1, oy+0.05, 0, thick, 0.05, thick)); // R
                geos.push(GeoUtils.transform(Primitives.createCube(), ox+0.05, oy, 0, 0.05, thick, thick)); // B
                geos.push(GeoUtils.transform(Primitives.createCube(), ox+0.05, oy+0.1, 0, 0.05, thick, thick)); // T
            }
        }
        return GeoUtils.merge(geos);
    },

    createPlateChest: () => {
        const geos = [];
        // Breastplate
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.5, 0.2, 0.5, 0.6, 0.2));
        // Abs
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.8, 0.15, 0.4, 0.4, 0.15));
        return GeoUtils.merge(geos);
    },

    createHelmetKnight: () => {
        const geos = [];
        // Dome
        geos.push(GeoUtils.transform(Primitives.createSphere(8,8), 0, 2.0, 0, 0.25, 0.25, 0.25));
        // Visor
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.95, 0.2, 0.2, 0.1, 0.1));
        return GeoUtils.merge(geos);
    }
};
