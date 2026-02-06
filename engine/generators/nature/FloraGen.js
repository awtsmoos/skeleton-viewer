// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const FloraGen = {
    createPineTree: () => {
        const geos = [];
        // Trunk
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1, 0, 0.3, 1, 0.3));
        // Layers of cones
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 0, 2, 0, 1.5, 1, 1.5));
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 0, 3, 0, 1.2, 1, 1.2));
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 0, 4, 0, 0.8, 1, 0.8));
        return GeoUtils.merge(geos);
    },
    createOakTree: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1, 0, 0.5, 1, 0.5));
        // Canopy (Sphere blobs)
        geos.push(GeoUtils.transform(Primitives.createSphere(6,6), 0, 3, 0, 2, 1.5, 2));
        geos.push(GeoUtils.transform(Primitives.createSphere(6,6), 1, 2.5, 0.5, 1.5, 1.2, 1.5));
        return GeoUtils.merge(geos);
    },
    createBerryBush: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createSphere(5,5), 0, 0.5, 0, 0.8, 0.6, 0.8));
        // Berries
        geos.push(GeoUtils.transform(Primitives.createSphere(4,4), 0.5, 0.8, 0.2, 0.1, 0.1, 0.1));
        geos.push(GeoUtils.transform(Primitives.createSphere(4,4), -0.3, 0.6, 0.4, 0.1, 0.1, 0.1));
        return GeoUtils.merge(geos);
    },
    createGrassPatch: () => {
        const geos = [];
        const blade = Primitives.createPyramid(); // Pointy
        for(let i=0; i<20; i++) {
            const x = (Math.random()-0.5)*2;
            const z = (Math.random()-0.5)*2;
            geos.push(GeoUtils.transform(blade, x, 0.2, z, 0.05, 0.3, 0.05));
        }
        return GeoUtils.merge(geos);
    },
    createRose: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, 0, 0.02, 0.5, 0.02)); // Stem
        geos.push(GeoUtils.transform(Primitives.createSphere(5,5), 0, 1.0, 0, 0.15, 0.15, 0.15)); // Flower
        return GeoUtils.merge(geos);
    }
};
