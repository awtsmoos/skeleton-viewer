
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const KitchenGen = {
    createDoughBall: () => {
        // Deformed sphere
        return GeoUtils.transform(Primitives.createSphere(12,12), 0,0.2,0, 0.4, 0.3, 0.4);
    },
    createBreadLoaf: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createSphere(12,12), 0,0.2,0, 0.6, 0.4, 0.3)); // Main
        // Slices / Cuts
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, 0, 0.7, 0.05, 0.05));
        return GeoUtils.merge(geos);
    },
    createOvenStone: () => {
         const geos = [];
         // Stone arch
         geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 1.5, 0.1, 1.5)); // Floor
         geos.push(GeoUtils.transform(Primitives.createSphere(16,16), 0, 0, 0, 1.4, 1.2, 1.4)); // Dome (cut in half by floor visually)
         return GeoUtils.merge(geos);
    }
};
