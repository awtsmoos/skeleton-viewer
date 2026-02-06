
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const JudaicaGen = {
    createTanya: () => {
        const geos = [];
        // Cover
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.6, 0.8, 0.1));
        // Pages (Golden edges)
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.03, 0, 0, 0.55, 0.75, 0.08));
        // Title Plate
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.2, 0.06, 0.4, 0.2, 0.01));
        return GeoUtils.merge(geos);
    },

    create770Facade: () => {
        const geos = [];
        const brick = Primitives.createCube();
        
        // Main Body (Center Gabled Section)
        geos.push(GeoUtils.transform(brick, 0, 2, 0, 2.0, 2.0, 1.0));
        // Roof (Pyramid stretched)
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 0, 4.5, 0, 2.0, 1.0, 1.0));
        
        // Left Wing
        geos.push(GeoUtils.transform(brick, -2.5, 1.5, 0, 1.5, 1.5, 1.0));
        geos.push(GeoUtils.transform(Primitives.createPyramid(), -2.5, 3.5, 0, 1.5, 0.8, 1.0));
        
        // Right Wing
        geos.push(GeoUtils.transform(brick, 2.5, 1.5, 0, 1.5, 1.5, 1.0));
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 2.5, 3.5, 0, 1.5, 0.8, 1.0));
        
        // Bay Windows (3 vertical strips)
        geos.push(GeoUtils.transform(brick, -0.8, 2, 1.0, 0.3, 1.2, 0.2));
        geos.push(GeoUtils.transform(brick, 0, 2, 1.0, 0.3, 1.2, 0.2));
        geos.push(GeoUtils.transform(brick, 0.8, 2, 1.0, 0.3, 1.2, 0.2));
        
        return GeoUtils.merge(geos);
    },

    createTzedakahBox: () => {
        const geos = [];
        // Box
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, 0, 0.4, 0.5, 0.4));
        // Lid
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.05, 0, 0.42, 0.05, 0.42));
        // Slot
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.06, 0, 0.2, 0.02, 0.05));
        return GeoUtils.merge(geos);
    }
};
