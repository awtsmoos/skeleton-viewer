
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const AnimalGen = {
    createElephant: () => {
        const geos = [];
        const body = Primitives.createSphere(12,12);
        const limb = Primitives.createCube();
        
        // Body
        geos.push(GeoUtils.transform(body, 0, 1.5, 0, 1.5, 1.5, 2.0));
        // Head
        geos.push(GeoUtils.transform(body, 0, 2.0, 2.0, 1.0, 1.0, 1.0));
        // Trunk
        geos.push(GeoUtils.transform(limb, 0, 1.0, 3.0, 0.2, 1.0, 0.2));
        // Ears
        geos.push(GeoUtils.transform(Primitives.createPlane(4), 1.2, 2.0, 1.5, 0.8, 1.0, 0.1));
        geos.push(GeoUtils.transform(Primitives.createPlane(4), -1.2, 2.0, 1.5, 0.8, 1.0, 0.1));
        // Legs
        const leg = (x, z) => GeoUtils.transform(limb, x, 0.75, z, 0.35, 0.75, 0.35);
        geos.push(leg(1, 1)); geos.push(leg(-1, 1));
        geos.push(leg(1, -1)); geos.push(leg(-1, -1));
        
        return GeoUtils.merge(geos);
    },

    createGiraffe: () => {
        const geos = [];
        const body = Primitives.createCube();
        // Torso
        geos.push(GeoUtils.transform(body, 0, 2.0, 0, 0.8, 0.8, 1.2));
        // Neck
        geos.push(GeoUtils.transform(body, 0, 3.5, 1.0, 0.3, 1.5, 0.3));
        // Head
        geos.push(GeoUtils.transform(body, 0, 5.0, 1.2, 0.3, 0.3, 0.5));
        // Legs (Long)
        const leg = (x, z) => GeoUtils.transform(body, x, 1.0, z, 0.15, 1.0, 0.15);
        geos.push(leg(0.5, 0.8)); geos.push(leg(-0.5, 0.8));
        geos.push(leg(0.5, -0.8)); geos.push(leg(-0.5, -0.8));
        
        return GeoUtils.merge(geos);
    },
    
    createLion: () => {
        const geos = [];
        // Body
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.8, 0, 0.5, 0.6, 1.0));
        // Head
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.2, 1.0, 0.4, 0.4, 0.5));
        // Mane (Sphere around head)
        geos.push(GeoUtils.transform(Primitives.createSphere(8,8), 0, 1.2, 0.8, 0.6, 0.6, 0.6));
        // Legs
        const leg = (x, z) => GeoUtils.transform(Primitives.createCube(), x, 0.4, z, 0.15, 0.4, 0.15);
        geos.push(leg(0.3, 0.8)); geos.push(leg(-0.3, 0.8));
        geos.push(leg(0.3, -0.8)); geos.push(leg(-0.3, -0.8));
        
        return GeoUtils.merge(geos);
    }
};
