// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const TerrainGen = {
    createBoulder: () => {
        // Deformed sphere? Just a low poly sphere for now
        return GeoUtils.transform(Primitives.createSphere(5,5), 0,0.5,0, 1, 0.8, 1);
    },
    createPeak: () => {
        return GeoUtils.transform(Primitives.createPyramid(), 0, 2, 0, 3, 2, 3);
    },
    createPond: () => {
        return GeoUtils.transform(Primitives.createPlane(10), 0, 0.05, 0, 3, 1, 3);
    }
};
