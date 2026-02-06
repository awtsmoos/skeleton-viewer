// B"H
import { GeoUtils } from './GeoUtils.js';
import { Primitives } from './Primitives.js';
import { LoftEngine } from '../geometry/LoftEngine.js';
import { Eretz } from './Eretz.js';

export const Ilanot = {
    generate: (posX = 0, posZ = 0) => {
        const wood = [];
        const leaves = [];
        
        // Find ground height at this point
        const yBase = Eretz.getHeight(posX / 60, posZ / 60) * 1.0; 

        const grow = (start, dir, r, depth) => {
            if (depth <= 0) {
                // EMANATE LEAF CLUSTER
                // Instead of a sphere, we create many small rotated quads
                const quad = Primitives.createPlane(1); // 2x2 plane
                for(let i=0; i<8; i++) {
                    const rx = (Math.random()-0.5)*0.8;
                    const ry = (Math.random()-0.5)*0.8;
                    const rz = (Math.random()-0.5)*0.8;
                    
                    const leaf = GeoUtils.transform(quad, start.x + rx, start.y + ry, start.z + rz, 0.4, 0.4, 0.4);
                    // Add some random rotation to vertices (simplified)
                    leaves.push(leaf);
                }
                return;
            }
            
            const len = depth * 0.4 + 0.5;
            const end = { x: start.x + dir.x * len, y: start.y + dir.y * len, z: start.z + dir.z * len };
            wood.push(LoftEngine.loftPath([start, end], [r, r*0.75], 8));
            
            const count = 2;
            for(let i=0; i<count; i++) {
                const angleSpread = 0.8;
                const nextDir = { 
                    x: dir.x + (Math.random()-0.5)*angleSpread, 
                    y: dir.y + (Math.random()*0.3 + 0.2), 
                    z: dir.z + (Math.random()-0.5)*angleSpread 
                };
                // Normalize nextDir
                const mag = Math.sqrt(nextDir.x**2 + nextDir.y**2 + nextDir.z**2);
                nextDir.x /= mag; nextDir.y /= mag; nextDir.z /= mag;

                grow(end, nextDir, r * 0.7, depth - 1);
            }
        };

        grow({x:0, y:yBase, z:0}, {x:0, y:1, z:0}, 0.35, 5);
        return { wood: GeoUtils.merge(wood), leaves: GeoUtils.merge(leaves) };
    }
};