
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const WaterEffectsGen = {
    createBubbleCluster: () => {
        const geos = [];
        const sphere = Primitives.createSphere(8,8);
        for(let i=0; i<20; i++) {
            const x = (Math.random()-0.5)*2;
            const y = (Math.random()-0.5)*4;
            const z = (Math.random()-0.5)*2;
            const s = Math.random() * 0.2 + 0.05;
            geos.push(GeoUtils.transform(sphere, x,y,z, s,s,s));
        }
        return GeoUtils.merge(geos);
    },
    
    createWhirlpool: () => {
        const geos = [];
        const ring = Primitives.createSphere(16,16); 
        for(let i=0; i<5; i++) {
             const y = -i * 0.5;
             const r = 3.0 - (i*0.5);
             geos.push(GeoUtils.transform(ring, 0, y, 0, r, 0.1, r));
        }
        return GeoUtils.merge(geos);
    },

    // THE YAM SUF GENERATOR
    createPartedSea: () => {
        const geos = [];
        const wall = Primitives.createPlane(20); // High res plane
        
        // We need to curve it. Since GeoUtils.transform is linear, we use vertex manipulation manually here?
        // Or we rely on the Shader to curve it (VS_WATER).
        // Let's create two massive walls rotated 90 degrees.
        
        // Left Wall
        const left = GeoUtils.transform(wall, -15, 10, 0, 10, 1, 50);
        // Rotate vertices to be vertical (Plane starts flat)
        // Rotate 90 around Z axis: x' = -y, y' = x
        for(let i=0; i<left.vertices.length; i+=3) {
            const x = left.vertices[i];
            const y = left.vertices[i+1];
            left.vertices[i] = -y - 15; // Offset
            left.vertices[i+1] = x + 10; // Height
            
            // Curve the top inward (Crucial for the "Tunnel" look)
            // If y is high, pull x inward
            if (left.vertices[i+1] > 15) {
                left.vertices[i] += 5.0; // Curl over
            }
        }
        geos.push(left);

        // Right Wall
        const right = GeoUtils.transform(wall, 15, 10, 0, 10, 1, 50);
        for(let i=0; i<right.vertices.length; i+=3) {
            const x = right.vertices[i];
            const y = right.vertices[i+1];
            right.vertices[i] = y + 15; 
            right.vertices[i+1] = x + 10;
            
            if (right.vertices[i+1] > 15) {
                right.vertices[i] -= 5.0; // Curl over
            }
        }
        geos.push(right);
        
        // Floor (Dry land)
        geos.push(GeoUtils.transform(Primitives.createPlane(10), 0, 0, 0, 15, 1, 50));

        return GeoUtils.merge(geos);
    }
};
