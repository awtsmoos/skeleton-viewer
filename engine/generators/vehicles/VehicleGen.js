// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const VehicleGen = {
    createTire: () => {
        // Cube for now, rotated
        return GeoUtils.transform(Primitives.createCube(), 0,0,0, 0.5, 0.5, 0.2);
    },
    createCarChassis: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, 0, 1.0, 0.3, 2.0)); // Base
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.0, -0.2, 0.8, 0.3, 1.0)); // Cabin
        return GeoUtils.merge(geos);
    },
    createJetWing: () => {
        return GeoUtils.transform(Primitives.createPyramid(), 0,0,0, 2, 0.1, 1);
    },
    createUFODisk: () => {
        return GeoUtils.transform(Primitives.createSphere(16,16), 0,0,0, 3, 0.5, 3);
    }
};
