
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const LightningGen = {
    createBolt: () => {
        // Recursive fractal generation of a bolt
        const segments = [];
        const generate = (start, end, depth) => {
            if (depth === 0) {
                // Create a thin box from start to end
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const dz = end.z - start.z;
                const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // Midpoint for position
                const mx = (start.x + end.x) / 2;
                const my = (start.y + end.y) / 2;
                const mz = (start.z + end.z) / 2;
                
                // This is a rough approximation of orienting a cube. 
                // For true lightning, line renderers are better, but we use thin cubes.
                segments.push(GeoUtils.transform(Primitives.createCube(), mx, my, mz, 0.05, len/2, 0.05));
                return;
            }

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const midZ = (start.z + end.z) / 2;

            // Jitter
            const jit = 0.5;
            const jx = (Math.random()-0.5) * jit;
            const jy = (Math.random()-0.5) * jit;
            const jz = (Math.random()-0.5) * jit;

            const mid = { x: midX + jx, y: midY + jy, z: midZ + jz };
            
            generate(start, mid, depth - 1);
            generate(mid, end, depth - 1);
            
            // Fork
            if (Math.random() > 0.7) {
                 const forkEnd = { 
                    x: mid.x + (Math.random()-0.5)*2, 
                    y: mid.y - 1.0, 
                    z: mid.z + (Math.random()-0.5)*2 
                 };
                 generate(mid, forkEnd, depth - 1);
            }
        };

        generate({x:0, y:5, z:0}, {x:0, y:0, z:0}, 4);
        return GeoUtils.merge(segments);
    },
    
    createBallLightning: () => {
         const geos = [];
         geos.push(Primitives.createSphere(16,16));
         // Spikes
         for(let i=0; i<10; i++) {
             const scale = 1.5 + Math.random();
             geos.push(GeoUtils.transform(Primitives.createCube(), 0,0,0, 0.1, scale, 0.1));
             geos.push(GeoUtils.transform(Primitives.createCube(), 0,0,0, scale, 0.1, 0.1));
         }
         return GeoUtils.merge(geos);
    }
};
