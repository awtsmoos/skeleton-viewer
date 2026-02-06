// B"H
import { GeoUtils } from '../GeoUtils.js';
import { LoftEngine } from '../../geometry/LoftEngine.js';
import { Primitives } from '../Primitives.js';

export const FaceGen = {
    /**
     * Creates nose geometry
     */
    createNose: () => {
        const parts = [];
        const bridgePoints = [
            { x: 0, y: 1.68, z: 0.095 }, { x: 0, y: 1.65, z: 0.105 }, { x: 0, y: 1.62, z: 0.115 }
        ];
        parts.push(LoftEngine.loftPath(bridgePoints, [0.008, 0.01, 0.015], 8));
        
        parts.push(GeoUtils.transform(Primitives.createSphere(8, 8), 0, 1.615, 0.12, 0.018, 0.015, 0.018));
        
        parts.push(GeoUtils.transform(Primitives.createSphere(6, 6), -0.012, 1.61, 0.108, 0.012, 0.008, 0.01));
        parts.push(GeoUtils.transform(Primitives.createSphere(6, 6), 0.012, 1.61, 0.108, 0.012, 0.008, 0.01));
        
        return GeoUtils.merge(parts);
    },

    /**
     * Creates ear geometry
     */
    createEar: (side) => {
        const x = 0.1 * side;
        const parts = [];
        parts.push(GeoUtils.transform(Primitives.createSphere(8, 8), x, 1.67, -0.01, 0.018, 0.035, 0.012));
        parts.push(GeoUtils.transform(Primitives.createSphere(4, 4), x, 1.64, -0.005, 0.008, 0.012, 0.006));
        parts.push(GeoUtils.transform(Primitives.createSphere(4, 4), x * 0.92, 1.665, 0.005, 0.005, 0.008, 0.004));
        return GeoUtils.merge(parts);
    }
};