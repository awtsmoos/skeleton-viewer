// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const FlagGen = {
    createFlag: () => {
        // A plane where the left vertices (x < -0.9) are pinned (weight 1.0)
        // and the right vertices are loose (weight 0.0)
        
        const plane = Primitives.createPlane(10); 
        // Plane is -1 to 1 in X and Z.
        
        // Add pin weights attribute
        const weights = new Float32Array(plane.vertices.length / 3);
        
        for(let i=0; i<weights.length; i++) {
            const x = plane.vertices[i*3];
            // If X is near -1 (the pole side), weight is 1.0
            if (x < -0.9) weights[i] = 1.0;
            else weights[i] = 0.0;
        }
        
        // We need to return this in a way the uploader understands.
        // For now, we attach it to the geo object.
        plane.pinWeights = weights;
        
        // Rotate it to hang down? No, standard flag flies horizontally
        return plane; 
    }
};
