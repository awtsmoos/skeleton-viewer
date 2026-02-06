// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const ToolGen = {
    createHose: () => {
        const geos = [];
        // Nozzle
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0.5, 0.1, 0.1, 0.5));
        // Handle
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, -0.3, 0.2, 0.08, 0.3, 0.08));
        // Tube coil
        const ring = Primitives.createSphere(8,8);
        geos.push(GeoUtils.transform(ring, 0, 0, -0.5, 0.3, 0.3, 0.1));
        return GeoUtils.merge(geos);
    },
    
    createFish: () => {
        const geos = [];
        // Body
        geos.push(GeoUtils.transform(Primitives.createSphere(12,12), 0,0,0, 0.2, 0.3, 0.8));
        // Tail
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, -0.9, 0.05, 0.3, 0.3));
        // Fins
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.2, 0, 0.2, 0.2, 0.05, 0.2));
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.2, 0, 0.2, 0.2, 0.05, 0.2));
        // Eyes
        geos.push(GeoUtils.transform(Primitives.createSphere(4,4), 0.15, 0.1, 0.6, 0.05, 0.05, 0.05));
        geos.push(GeoUtils.transform(Primitives.createSphere(4,4), -0.15, 0.1, 0.6, 0.05, 0.05, 0.05));
        
        return GeoUtils.merge(geos);
    },

    createFan: () => {
        const geos = [];
        // Base
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, -1.0, 0, 0.5, 0.1, 0.5));
        // Stand
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, -0.5, 0, 0.1, 0.5, 0.1));
        // Cage (Ring)
        geos.push(GeoUtils.transform(Primitives.createSphere(16,16), 0, 0, 0, 1.0, 1.0, 0.1));
        // Center hub
        geos.push(GeoUtils.transform(Primitives.createSphere(8,8), 0, 0, 0, 0.2, 0.2, 0.2));
        // Blades
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, 0, 0.1, 0.4, 0.05));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, -0.5, 0, 0.1, 0.4, 0.05));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.5, 0, 0, 0.4, 0.1, 0.05));
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.5, 0, 0, 0.4, 0.1, 0.05));
        return GeoUtils.merge(geos);
    }
};
