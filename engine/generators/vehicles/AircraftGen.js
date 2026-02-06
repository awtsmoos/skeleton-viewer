// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const AircraftGen = {
    createPlane: () => {
        const geos = [];
        // Fuselage
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.5, 0.5, 2.0));
        // Wings
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0.5, 3.0, 0.1, 0.8));
        // Tail
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, -1.8, 0.1, 0.5, 0.5));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, -1.8, 1.0, 0.1, 0.4));
        return GeoUtils.merge(geos);
    },
    createHelicopter: () => {
        const geos = [];
        // Body
        geos.push(GeoUtils.transform(Primitives.createSphere(8,8), 0,0,0, 0.8, 0.8, 1.2));
        // Tail boom
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, -1.5, 0.1, 0.1, 1.5));
        // Rotor
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.0, 0, 3.0, 0.05, 0.1));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.0, 0, 0.1, 0.05, 3.0));
        return GeoUtils.merge(geos);
    }
};
