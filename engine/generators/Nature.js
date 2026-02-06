
// B"H
/**
 * NatureGen: The Garden of Eden.
 * Constantly forming the earth, the thick waters, and the branching trees.
 */
import { GeoUtils } from './GeoUtils.js';
import { Primitives } from './Primitives.js';
import { LoftEngine } from '../geometry/LoftEngine.js';
import { Vec3 } from '../math/Vec3.js';
import { SimplexNoise } from '../math/SimplexNoise.js';

const noise = new SimplexNoise();

export const NatureGen = {
    getRiverDepth: (x, z) => {
        const riverCenter = Math.sin(z * 0.04) * 20.0; 
        const dist = Math.abs(x - riverCenter);
        const width = 25.0; 
        if (dist < width) {
            let t = dist / width;
            let profile = Math.pow(1.0 - t, 0.5); 
            return profile * 15.0; 
        }
        return 0;
    },

    getTerrainHeight: (x, z) => {
        let h = noise.noise2D(x * 0.015, z * 0.015) * 12.0;
        h += noise.noise2D(x * 0.04, z * 0.04) * 4.0;
        const riverCut = NatureGen.getRiverDepth(x, z);
        h -= riverCut;
        return h;
    },

    getTerrainNormal: (x, z) => {
        const d = 0.5;
        const hL = NatureGen.getTerrainHeight(x - d, z);
        const hR = NatureGen.getTerrainHeight(x + d, z);
        const hD = NatureGen.getTerrainHeight(x, z - d);
        const hU = NatureGen.getTerrainHeight(x, z + d);
        return Vec3.normalize({ x: hL - hR, y: 2 * d, z: hD - hU });
    },

    createTerrain: () => {
        const size = 500;
        const segments = 180;
        const vertices = [];
        const normals = [];
        const indices = [];
        for (let z = 0; z <= segments; z++) {
            for (let x = 0; x <= segments; x++) {
                const px = (x / segments - 0.5) * size;
                const pz = (z / segments - 0.5) * size;
                const py = NatureGen.getTerrainHeight(px, pz);
                vertices.push(px, py, pz);
                const n = NatureGen.getTerrainNormal(px, pz);
                normals.push(n.x, n.y, n.z);
            }
        }
        for (let z = 0; z < segments; z++) {
            for (let x = 0; x < segments; x++) {
                const a = z * (segments + 1) + x;
                const b = a + 1;
                const c = (z + 1) * (segments + 1) + x;
                const d = c + 1;
                indices.push(a, c, b);
                indices.push(b, c, d);
            }
        }
        return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint32Array(indices) };
    },

    createGrass: () => {
        const blades = [];
        for (let i = 0; i < 30000; i++) {
            const x = (Math.random() - 0.5) * 450;
            const z = (Math.random() - 0.5) * 450;
            if (NatureGen.getRiverDepth(x, z) > 1.0) continue; 
            const baseY = NatureGen.getTerrainHeight(x, z);
            const pts = [{x, y: baseY, z}, {x, y: baseY + 0.6, z}];
            blades.push(LoftEngine.loftPath(pts, [0.04, 0], 3));
        }
        return LoftEngine.weld(blades, 0.001);
    },

    createTree: (type = 'oak') => {
        const woodParts = [];
        const leafParts = [];
        
        const grow = (start, dir, radius, length, depth) => {
            if (depth <= 0 || radius < 0.08) {
                // SACRED FOLIAGE: Cross-Quads (UV mapped vertical planes)
                const plane1 = Primitives.createPlane(1);
                // Rotate to be vertical (XY plane)
                for(let i=0; i<plane1.vertices.length; i+=3) {
                    const py = plane1.vertices[i+1];
                    const pz = plane1.vertices[i+2];
                    plane1.vertices[i+1] = pz;
                    plane1.vertices[i+2] = -py;
                }
                const leaf1 = GeoUtils.transform(plane1, start.x, start.y, start.z, 6.0, 6.0, 6.0);
                leaf1.texcoords = new Float32Array([0,0, 1,0, 0,1, 1,1]);
                
                const leaf2 = {
                    vertices: new Float32Array(leaf1.vertices),
                    normals: new Float32Array(leaf1.normals),
                    indices: new Uint32Array(leaf1.indices),
                    texcoords: new Float32Array(leaf1.texcoords)
                };
                // Rotate leaf2 by 90 deg around Y to cross
                for(let i=0; i<leaf2.vertices.length; i+=3) {
                    const vx = leaf2.vertices[i] - start.x;
                    const vz = leaf2.vertices[i+2] - start.z;
                    leaf2.vertices[i] = -vz + start.x;
                    leaf2.vertices[i+2] = vx + start.z;
                }
                leafParts.push(leaf1, leaf2);
                return;
            }

            const end = Vec3.add(start, Vec3.mul(dir, length));
            woodParts.push(LoftEngine.loftPath([start, end], [radius, radius * 0.8], 8));

            // BREATHING LOGIC: Branch at multiple levels, not just the top
            const count = (depth > 5) ? 1 : (Math.random() > 0.3 ? 3 : 2);
            for(let i=0; i<count; i++) {
                const spread = 0.9;
                const nextDir = Vec3.normalize({
                    x: dir.x + (Math.random()-0.5) * spread,
                    y: dir.y + (Math.random() * 0.5), // Encourage upward growth
                    z: dir.z + (Math.random()-0.5) * spread
                });
                grow(end, nextDir, radius * 0.75, length * 0.85, depth - 1);
            }
        };

        // Start smaller base to encourage branching sooner
        grow({x:0, y:0, z:0}, {x:0, y:1, z:0}, 1.3, 6.0, 7); 

        return {
            wood: LoftEngine.weld(woodParts, 0.01),
            leaves: GeoUtils.merge(leafParts)
        };
    },

    createRiverBed: () => {
        const lengthSegs = 200;
        const width = 35.0; 
        const riverThickness = 1.0; // Reduced thickness so it sits inside the cut correctly
        const vertices = [];
        const normals = [];
        const indices = [];
        for (let l = 0; l <= lengthSegs; l++) {
            const z = (l / lengthSegs - 0.5) * 500; 
            const riverX = Math.sin(z * 0.04) * 20.0; 
            
            // Calculate base noise (uncut terrain height)
            let baseH = noise.noise2D(riverX * 0.015, z * 0.015) * 12.0;
            baseH += noise.noise2D(riverX * 0.04, z * 0.04) * 4.0;
            
            // The water surface should be slightly below the surrounding banks but well above the cut bottom
            const waterY = baseH - 2.0; 
            
            vertices.push(riverX - width/2, waterY, z); normals.push(0, 1, 0);
            vertices.push(riverX + width/2, waterY, z); normals.push(0, 1, 0);
            vertices.push(riverX - width/2, waterY - riverThickness, z); normals.push(0, -1, 0);
            vertices.push(riverX + width/2, waterY - riverThickness, z); normals.push(0, -1, 0);
        }
        for (let l = 0; l < lengthSegs; l++) {
            const b = l * 4; const n = (l + 1) * 4;
            indices.push(b+0, n+0, b+1); indices.push(b+1, n+0, n+1);
            indices.push(b+0, b+2, n+0); indices.push(b+2, n+2, n+0);
            indices.push(b+1, n+1, b+3); indices.push(b+3, n+1, n+3);
        }
        return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint32Array(indices) };
    }
};
