// B"H
/**
 * HairMeshGen: The Crown of Glory.
 * Generates procedural hair volumes.
 */
import { GeoUtils } from '../../generators/GeoUtils.js';
import { Primitives } from '../../generators/Primitives.js';

export const HairMeshGen = {
    generateAll: (dna) => {
        const parts = [];
        // Crown Hair
        parts.push(GeoUtils.transform(Primitives.createSphere(12,12), 0, 1.82, 0, 0.1, 0.08, 0.12));
        
        // Beard
        parts.push(GeoUtils.transform(Primitives.createSphere(10,10), 0, 1.55, 0.08, 0.08, 0.08, 0.05));
        
        // Mustache
        parts.push(GeoUtils.transform(Primitives.createCube(), 0, 1.6, 0.1, 0.05, 0.01, 0.01));
        
        return parts.map(p => ({ geo: p, type: 'hair', color: [0.1, 0.05, 0] }));
    }
};