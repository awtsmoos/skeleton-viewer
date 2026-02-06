// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const SpaceGen = {
    createRocket: () => {
        const geos = [];
        // Body
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 2, 0, 0.5, 2.0, 0.5));
        // Cone
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 0, 4.5, 0, 0.5, 0.8, 0.5));
        // Fins
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.8, 0.5, 0, 0.5, 0.5, 0.1));
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.8, 0.5, 0, 0.5, 0.5, 0.1));
        return GeoUtils.merge(geos);
    },
    createSatellite: () => {
        const geos = [];
        // Core
        geos.push(GeoUtils.transform(Primitives.createCube(), 0,0,0, 0.5, 0.5, 0.5));
        // Solar Arrays
        geos.push(GeoUtils.transform(Primitives.createPlane(2), 1.5, 0, 0, 1.0, 1, 0.4));
        geos.push(GeoUtils.transform(Primitives.createPlane(2), -1.5, 0, 0, 1.0, 1, 0.4));
        // Dish
        geos.push(GeoUtils.transform(Primitives.createSphere(8,8), 0, 0.6, 0, 0.3, 0.1, 0.3));
        return GeoUtils.merge(geos);
    }
};
