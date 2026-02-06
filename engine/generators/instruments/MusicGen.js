// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const MusicGen = {
    createGrandPiano: () => {
        const geos = [];
        const cube = Primitives.createCube();
        // Body (Curve approximated by cubes for now)
        geos.push(GeoUtils.transform(cube, 0, 1.5, 0, 2.0, 0.5, 3.0));
        // Lid (Open)
        geos.push(GeoUtils.transform(Primitives.createPlane(2), -0.5, 3.0, 0, 1.8, 1, 2.8)); // Rotated via logic
        // Keys
        for(let i=0; i<12; i++) {
            geos.push(GeoUtils.transform(cube, -1.0 + i*0.16, 1.5, 3.1, 0.07, 0.1, 0.3));
        }
        // Legs
        geos.push(GeoUtils.transform(cube, -1.5, 0.75, 2.0, 0.2, 0.75, 0.2));
        geos.push(GeoUtils.transform(cube, 1.5, 0.75, 2.0, 0.2, 0.75, 0.2));
        geos.push(GeoUtils.transform(cube, 0, 0.75, -2.0, 0.2, 0.75, 0.2));
        return GeoUtils.merge(geos);
    },

    createElectricGuitar: () => {
        const geos = [];
        const cube = Primitives.createCube();
        // Body (Strat shape approx)
        geos.push(GeoUtils.transform(cube, 0, 0, 0, 0.5, 0.8, 0.1));
        // Neck
        geos.push(GeoUtils.transform(cube, 0, 1.2, 0, 0.1, 0.8, 0.05));
        // Headstock
        geos.push(GeoUtils.transform(cube, 0, 2.1, 0, 0.15, 0.2, 0.05));
        return GeoUtils.merge(geos);
    }
};
