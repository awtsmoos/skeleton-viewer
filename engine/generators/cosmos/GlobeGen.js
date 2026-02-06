
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const GlobeGen = {
    createHolographicEarth: () => {
        const geos = [];
        // Core sphere
        geos.push(GeoUtils.transform(Primitives.createSphere(32,32), 0,0,0, 1,1,1));
        // Orbital rings
        for(let i=0; i<3; i++) {
            const r = 1.2 + i*0.2;
            const ring = Primitives.createSphere(24,24);
            // Flatten to ring
            geos.push(GeoUtils.transform(ring, 0,0,0, r, 0.02, r));
        }
        return GeoUtils.merge(geos);
    }
};
