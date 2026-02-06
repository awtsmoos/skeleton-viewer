// B"H
import { Primitives } from './Primitives.js';
import { GeoUtils } from './GeoUtils.js';
import { GlobeGen } from './cosmos/GlobeGen.js';

export const CosmosGen = {
    createBlackHole: () => {
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createSphere(32,32), 0,0,0, 2,2,2)); // Event Horizon
        geos.push(GeoUtils.transform(Primitives.createSphere(32,32), 0,0,0, 5, 0.1, 5)); // Disk
        return GeoUtils.merge(geos);
    },
    createStar: () => Primitives.createSphere(16,16),
    createGalaxySpiral: GlobeGen.createHolographicEarth 
};
