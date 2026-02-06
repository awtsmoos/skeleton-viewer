// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const AccessoriesGen = {
    createTopHat: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.6, 0.05, 0.6)); // Brim
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.4, 0, 0.4, 0.4, 0.4)); // Top
        return GeoUtils.merge(geos);
    },
    createBackpack: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.4, 0.5, 0.3));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, -0.2, 0.3, 0.3, 0.2, 0.1)); // Pocket
        return GeoUtils.merge(geos);
    }
};
