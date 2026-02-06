// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { createObject } from '../../../types/objects.js';

export const ClothGen = {
    createFlag: () => {
        const plane = Primitives.createPlane(10); 
        const weights = new Float32Array(plane.vertices.length / 3);
        for(let i=0; i<weights.length; i++) {
            weights[i] = (plane.vertices[i*3] < -0.9) ? 1.0 : 0.0;
        }
        plane.pinWeights = weights;
        return plane; 
    },
    
    // --- SUIT COMPONENTS ---
    createSuitJacket: () => {
        const geos = [];
        // Torso
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.2, 0, 0.55, 0.7, 0.35));
        // Lapels
        geos.push(GeoUtils.transform(Primitives.createPlane(2), -0.15, 0.5, 0.36, 0.1, 0.4, 0.1));
        geos.push(GeoUtils.transform(Primitives.createPlane(2), 0.15, 0.5, 0.36, 0.1, 0.4, 0.1));
        // Sleeves (Upper)
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.6, 0.5, 0, 0.15, 0.4, 0.15));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.6, 0.5, 0, 0.15, 0.4, 0.15));
        return GeoUtils.merge(geos);
    },

    createTie: () => {
        const geos = [];
        // Knot
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.75, 0.38, 0.08, 0.08, 0.05));
        // Body
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.35, 0.38, 0.08, 0.4, 0.02));
        return GeoUtils.merge(geos);
    },

    createTrousers: () => {
        const geos = [];
        // Pelvis area
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.5, 0.3, 0.3));
        // Legs
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.2, -0.6, 0, 0.18, 0.6, 0.2));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.2, -0.6, 0, 0.18, 0.6, 0.2));
        return GeoUtils.merge(geos);
    },

    // --- ANCIENT ---
    createRobeTop: () => {
        const robe = createObject('robe_top', 'cube', 'Robe Tunic');
        robe.transform.scale = {x: 0.6, y: 0.7, z: 0.4};
        robe.material.color = [0.8, 0.1, 0.1]; 
        robe.material.type = 'soft_cloth';
        return robe;
    },
    
    createRobeSkirt: () => {
        const skirt = createObject('robe_skirt', 'cube', 'Robe Skirt');
        skirt.transform.position.y = -0.8;
        skirt.transform.scale = {x: 0.5, y: 0.8, z: 0.5};
        skirt.material.color = [0.8, 0.1, 0.1];
        skirt.material.type = 'soft_cloth';
        return skirt;
    },

    createCape: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.5, -0.2, 0.4, 0.05, 0.05));
        geos.push(GeoUtils.transform(Primitives.createPlane(8), 0, 0.5, -0.3, 0.5, 1, 0.1));
        return GeoUtils.merge(geos);
    },
    
    createTent: () => GeoUtils.transform(Primitives.createPyramid(), 0, 1, 0, 2, 1.5, 2),
    createRug: () => GeoUtils.transform(Primitives.createPlane(1), 0, 0.01, 0, 2, 1, 3)
};