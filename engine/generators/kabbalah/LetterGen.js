
// B"H
import { GeoUtils } from '../GeoUtils.js';

export const LetterGen = {
    createAleph: () => LetterGen.createFromPath([
        // Vav (Diagonal)
        [{x:-0.5,y:0.5,z:0}, {x:0.5,y:-0.5,z:0}],
        // Upper Yud
        [{x:0.3,y:0.3,z:0}, {x:0.6,y:0.6,z:0}],
        // Lower Yud
        [{x:-0.3,y:-0.3,z:0}, {x:-0.6,y:-0.6,z:0}]
    ]),

    createShin: () => LetterGen.createFromPath([
        // Base
        [{x:-0.5,y:-0.5,z:0}, {x:0.5,y:-0.5,z:0}],
        // Left arm
        [{x:-0.5,y:-0.5,z:0}, {x:-0.7,y:0.5,z:0}],
        // Right arm
        [{x:0.5,y:-0.5,z:0}, {x:0.7,y:0.5,z:0}],
        // Center arm
        [{x:0,y:-0.5,z:0}, {x:0,y:0.6,z:0}]
    ]),
    
    createMem: () => LetterGen.createFromPath([
        // Box shape roughly
        [{x:0.5,y:-0.5,z:0}, {x:0.5,y:0.5,z:0}, {x:-0.5,y:0.5,z:0}, {x:-0.5,y:-0.5,z:0}] // Open bottom left slightly
    ]),

    // Tube Extrusion Algorithm
    createFromPath: (paths, thickness = 0.05) => {
        const geos = [];
        const radialSegs = 6;
        
        paths.forEach(path => {
            const vertices = [];
            const normals = [];
            const indices = [];
            
            for(let i=0; i<path.length; i++) {
                const p = path[i];
                // Direction for orientation
                const next = path[i+1] || path[i];
                const prev = path[i-1] || path[i];
                const dir = { x: next.x - prev.x, y: next.y - prev.y, z: next.z - prev.z };
                
                // Normalize dir (rudimentary)
                const len = Math.sqrt(dir.x*dir.x + dir.y*dir.y + dir.z*dir.z) || 1;
                dir.x/=len; dir.y/=len; dir.z/=len;
                
                // Create ring
                for(let r=0; r<radialSegs; r++) {
                    const theta = (r/radialSegs) * Math.PI * 2;
                    // Circle in XY plane, rotated to look along dir? 
                    // Simplified: Just expand in Z/X plane relative to Y up, but text is flat.
                    // We assume text is on XY plane mostly.
                    const cx = Math.cos(theta) * thickness;
                    const cz = Math.sin(theta) * thickness;
                    
                    vertices.push(p.x + cx, p.y, p.z + cz);
                    normals.push(cx, 0, cz); // Approx
                }
            }
            
            // Connect rings
            for(let i=0; i<path.length-1; i++) {
                for(let r=0; r<radialSegs; r++) {
                    const curr = (i * radialSegs) + r;
                    const next = curr + radialSegs;
                    const nextR = (i * radialSegs) + ((r+1)%radialSegs);
                    const nextNextR = nextR + radialSegs;
                    
                    indices.push(curr, next, nextR);
                    indices.push(nextR, next, nextNextR);
                }
            }
            
            geos.push({ vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) });
        });
        
        return GeoUtils.merge(geos);
    }
};
