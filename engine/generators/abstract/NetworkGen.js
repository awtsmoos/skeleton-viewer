
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const NetworkGen = {
    // A cloud of connected nodes
    createNetworkGraph: (nodeCount = 20, radius = 10) => {
        const geos = [];
        const nodeGeo = Primitives.createSphere(8,8);
        const linkGeo = Primitives.createCube(); // Thin lines
        
        const nodes = [];
        
        // Create Nodes
        for(let i=0; i<nodeCount; i++) {
            const pos = {
                x: (Math.random()-0.5) * radius,
                y: (Math.random()-0.5) * radius,
                z: (Math.random()-0.5) * radius
            };
            nodes.push(pos);
            geos.push(GeoUtils.transform(nodeGeo, pos.x, pos.y, pos.z, 0.2, 0.2, 0.2));
        }
        
        // Create Connections (Edges)
        // Connect each node to 2-3 nearest neighbors
        nodes.forEach((n1, i) => {
            nodes.forEach((n2, j) => {
                if (i >= j) return; // distinct pairs
                const dist = Math.sqrt(Math.pow(n2.x-n1.x,2) + Math.pow(n2.y-n1.y,2) + Math.pow(n2.z-n1.z,2));
                
                if (dist < radius * 0.4) {
                    // Create line from n1 to n2
                    const mx = (n1.x + n2.x)/2;
                    const my = (n1.y + n2.y)/2;
                    const mz = (n1.z + n2.z)/2;
                    
                    // Scale to length (Approximation, no rotation in GeoUtils yet so connections look 'blocky' but stylized)
                    // For "Retro" look, axis aligned links are actually cool (Manhattan distance style)
                    // Or we assume standard links.
                    
                    // Simple: Thin cubes at nodes? No, we need lines.
                    // Let's create small particles along the line.
                    const steps = Math.floor(dist * 2);
                    for(let k=0; k<steps; k++) {
                        const t = k/steps;
                        const lx = n1.x + (n2.x - n1.x) * t;
                        const ly = n1.y + (n2.y - n1.y) * t;
                        const lz = n1.z + (n2.z - n1.z) * t;
                        geos.push(GeoUtils.transform(linkGeo, lx, ly, lz, 0.05, 0.05, 0.05));
                    }
                }
            });
        });
        
        return GeoUtils.merge(geos);
    },
    
    // The "Chain" in Blockchain
    createBlockChain: (length = 10) => {
        const geos = [];
        const block = Primitives.createCube();
        const link = Primitives.createCube(); // Chain link
        
        for(let i=0; i<length; i++) {
            const x = i * 2.5;
            // The Block
            geos.push(GeoUtils.transform(block, x, 0, 0, 0.8, 0.8, 0.8));
            
            // The Chain Link to next
            if (i < length - 1) {
                geos.push(GeoUtils.transform(link, x + 1.25, 0, 0, 0.5, 0.1, 0.1));
            }
        }
        return GeoUtils.merge(geos);
    }
};
