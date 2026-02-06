// B"H
import { Primitives } from './Primitives.js';
import { GeoUtils } from './GeoUtils.js';
import { SciFiGen } from './scifi/SciFiGen.js';

export const TechGen = {
    createMicrochip: () => {
        const geos = [];
        const cube = Primitives.createCube();
        geos.push(GeoUtils.transform(cube, 0, 0, 0, 1, 0.1, 1));
        const pins = 8;
        for(let i=0; i<pins; i++) {
             const offset = -1 + (i/(pins-1))*2;
             geos.push(GeoUtils.transform(cube, -1.1, -0.1, offset, 0.1, 0.1, 0.05));
             geos.push(GeoUtils.transform(cube, 1.1, -0.1, offset, 0.1, 0.1, 0.05));
        }
        return GeoUtils.merge(geos);
    },
    createServerRack: SciFiGen.createDeathStation 
};
