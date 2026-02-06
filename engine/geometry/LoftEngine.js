// B"H
import { Vec3 } from '../math/Vec3.js';

/**
 * LoftEngine: The Loom of Reality.
 * This engine weaves the skin of existence.
 */
export const LoftEngine = {
    /**
     * Lofts a path into a single mesh part.
     * Orients rings PERPENDICULAR to the path.
     */
    loftPath: (points, radii, segments = 16) => {
        const vertices = [];
        const normals = [];
        const indices = [];

        if (!points || points.length < 2) return { vertices, normals, indices };

        const vertPerRing = segments + 1; // +1 to duplicate first point for UV sealing

        // Validate points
        const cleanPoints = [points[0]];
        const cleanRadii = [Array.isArray(radii) ? radii[0] : radii];
        
        for(let i=1; i<points.length; i++) {
            const dist = Vec3.len(Vec3.sub(points[i], points[i-1]));
            if (dist > 0.0001) {
                cleanPoints.push(points[i]);
                cleanRadii.push(Array.isArray(radii) ? radii[i] : radii);
            }
        }
        
        if (cleanPoints.length < 2) return { vertices, normals, indices };

        const finalPoints = cleanPoints;
        const finalRadii = cleanRadii;
        const finalCount = finalPoints.length;

        for (let i = 0; i < finalCount; i++) {
            const p = finalPoints[i];
            const r = finalRadii[i];
            
            let tangent;
            if (i < finalCount - 1) tangent = Vec3.normalize(Vec3.sub(finalPoints[i + 1], p));
            else tangent = Vec3.normalize(Vec3.sub(p, finalPoints[i - 1]));
            
            // Robust up-vector
            let upCandidate = { x: 0, y: 1, z: 0 };
            if (Math.abs(Vec3.dot(tangent, upCandidate)) > 0.9) upCandidate = { x: 0, y: 0, z: 1 };
            
            const right = Vec3.normalize(Vec3.cross(tangent, upCandidate));
            const up = Vec3.normalize(Vec3.cross(right, tangent));

            for (let j = 0; j <= segments; j++) { // <= to duplicate last vertex
                const theta = (j / segments) * Math.PI * 2;
                const cos = Math.cos(theta);
                const sin = Math.sin(theta);
                
                const vRight = Vec3.mul(right, r * cos);
                const vUp = Vec3.mul(up, r * sin);
                const offset = Vec3.add(vRight, vUp);
                const v = Vec3.add(p, offset);
                
                vertices.push(v.x, v.y, v.z);
                
                let n = Vec3.normalize(offset);
                if (isNaN(n.x)) n = {x:0, y:1, z:0};
                
                normals.push(n.x, n.y, n.z);
            }
        }

        for (let i = 0; i < finalCount - 1; i++) {
            for (let j = 0; j < segments; j++) {
                const r1 = i * vertPerRing;
                const r2 = (i + 1) * vertPerRing;
                
                const a = r1 + j;
                const b = r1 + j + 1;
                const c = r2 + j;
                const d = r2 + j + 1;
                
                // CCW Winding order to point normals outward
                indices.push(a, b, c); // Bottom-Left, Bottom-Right, Top-Left
                indices.push(b, d, c); // Bottom-Right, Top-Right, Top-Left
            }
        }

        return { vertices, normals, indices };
    },

    weld: (geos, threshold = 0.01) => {
        const weldedVertices = [];
        const weldedNormals = [];
        const weldedIndices = [];
        
        const vertexMap = new Map();
        const invThreshold = 1 / threshold;
        
        const parts = Array.isArray(geos) ? geos : [geos];

        parts.forEach(g => {
            if (!g || !g.vertices || g.vertices.length === 0) return;

            const remap = new Array(g.vertices.length / 3);
            
            for (let i = 0; i < g.vertices.length; i += 3) {
                const x = g.vertices[i];
                const y = g.vertices[i+1];
                const z = g.vertices[i+2];

                const key = `${Math.round(x * invThreshold)},${Math.round(y * invThreshold)},${Math.round(z * invThreshold)}`;

                if (vertexMap.has(key)) {
                    remap[i/3] = vertexMap.get(key);
                } else {
                    const newIndex = weldedVertices.length / 3;
                    weldedVertices.push(x, y, z);
                    if (g.normals && g.normals.length > i+2) {
                        weldedNormals.push(g.normals[i], g.normals[i+1], g.normals[i+2]);
                    } else {
                        weldedNormals.push(0, 1, 0);
                    }
                    vertexMap.set(key, newIndex);
                    remap[i/3] = newIndex;
                }
            }
            
            for (let i = 0; i < g.indices.length; i++) {
                const oldIndex = g.indices[i];
                const newIndex = remap[oldIndex];
                if (newIndex !== undefined) {
                    weldedIndices.push(newIndex);
                }
            }
        });
        
        const use32bit = weldedVertices.length / 3 > 65535;
        return { 
            vertices: new Float32Array(weldedVertices), 
            normals: new Float32Array(weldedNormals), 
            indices: use32bit ? new Uint32Array(weldedIndices) : new Uint16Array(weldedIndices)
        };
    }
};
