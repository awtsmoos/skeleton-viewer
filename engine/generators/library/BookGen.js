
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const BookGen = {
    createBook: () => {
        const geos = [];
        // Cover
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.5, 0.7, 0.1));
        // Pages
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.05, 0, 0, 0.4, 0.65, 0.08));
        return GeoUtils.merge(geos);
    },
    createOpenBook: () => {
        const geos = [];
        // Left Page
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.3, 0, 0, 0.3, 0.02, 0.4));
        // Right Page
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.3, 0, 0, 0.3, 0.02, 0.4));
        // Spine hump
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, -0.02, 0, 0.1, 0.02, 0.4));
        return GeoUtils.merge(geos);
    }
};
