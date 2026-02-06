// B"H
/**
 * GeoUtils: The Sacred Alchemists.
 * Unifying and transforming the many into the one.
 */
export const GeoUtils = {
    merge: (geometries) => {
        let totalVertices = 0;
        let totalIndices = 0;
        let hasTex = false;

        geometries.forEach(g => {
            if (!g || !g.vertices) return;
            totalVertices += g.vertices.length / 3;
            totalIndices += g.indices.length;
            if (g.texcoords && g.texcoords.length > 0) hasTex = true;
        });

        const use32bit = totalVertices > 65535;
        const vertices = new Float32Array(totalVertices * 3);
        const normals = new Float32Array(totalVertices * 3);
        const texcoords = hasTex ? new Float32Array(totalVertices * 2) : null;
        const indices = use32bit ? new Uint32Array(totalIndices) : new Uint16Array(totalIndices);

        let vOffset = 0;
        let iOffset = 0;
        let uvOffset = 0;
        let vertexIndexOffset = 0;

        geometries.forEach(g => {
            if (!g || !g.vertices) return;
            
            // Copy Vertices & Normals
            vertices.set(g.vertices, vOffset);
            if (g.normals) normals.set(g.normals, vOffset);
            
            // Copy UVs if they exist
            if (hasTex) {
                if (g.texcoords) {
                    texcoords.set(g.texcoords, uvOffset);
                }
                uvOffset += (g.vertices.length / 3) * 2;
            }
            
            // Copy and offset indices
            for (let i = 0; i < g.indices.length; i++) {
                indices[iOffset + i] = g.indices[i] + vertexIndexOffset;
            }
            
            const numVerts = g.vertices.length / 3;
            vertexIndexOffset += numVerts;
            vOffset += g.vertices.length;
            iOffset += g.indices.length;
        });

        return { vertices, normals, texcoords, indices, use32bit };
    },

    transform: (geo, tx, ty, tz, sx = 1, sy = 1, sz = 1, rx=0, ry=0, rz=0) => {
        const v = new Float32Array(geo.vertices);
        const n = geo.normals ? new Float32Array(geo.normals) : new Float32Array(v.length);
        const t = geo.texcoords ? new Float32Array(geo.texcoords) : null;
        const indices = geo.indices;
        
        // Rotation Matrix logic simplified
        const cx = Math.cos(rx), sx_ = Math.sin(rx);
        const cy = Math.cos(ry), sy_ = Math.sin(ry);
        const cz = Math.cos(rz), sz_ = Math.sin(rz);

        for(let i=0; i<v.length; i+=3) {
            let x = v[i] * sx;
            let y = v[i+1] * sy;
            let z = v[i+2] * sz;

            // Rotate X
            let y1 = y*cx - z*sx_;
            let z1 = y*sx_ + z*cx;
            y=y1; z=z1;

            // Rotate Y
            let x1 = x*cy + z*sy_;
            z1 = -x*sy_ + z*cy;
            x=x1; z=z1;

            // Rotate Z
            x1 = x*cz - y*sz_;
            y1 = x*sz_ + y*cz;
            x=x1; y=y1;

            v[i]   = x + tx;
            v[i+1] = y + ty;
            v[i+2] = z + tz;
            
            // Normals (Rotate only)
            if(geo.normals) {
                let nx = n[i], ny = n[i+1], nz = n[i+2];
                // Rot X
                let ny1 = ny*cx - nz*sx_;
                let nz1 = ny*sx_ + nz*cx;
                ny=ny1; nz=nz1;
                // Rot Y
                let nx1 = nx*cy + nz*sy_;
                nz1 = -nx*sy_ + nz*cy;
                nx=nx1; nz=nz1;
                // Rot Z
                nx1 = nx*cz - ny*sz_;
                ny1 = nx*sz_ + ny*cz;
                nx=nx1; ny=ny1;
                
                // Re-normalize roughly
                const l = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
                n[i] = nx/l; n[i+1] = ny/l; n[i+2] = nz/l;
            }
        }
        return { vertices: v, normals: n, texcoords: t, indices, use32bit: geo.use32bit };
    },

    /**
     * Proportional Editing / Sculpting.
     * Deforms the mesh by pushing vertices within a radius of 'center' in 'direction'.
     */
    sculpt: (geo, center, radius, direction, strength, falloff = 'smooth') => {
        const v = geo.vertices;
        const r2 = radius * radius;
        
        for (let i = 0; i < v.length; i += 3) {
            const dx = v[i] - center.x;
            const dy = v[i+1] - center.y;
            const dz = v[i+2] - center.z;
            const distSq = dx*dx + dy*dy + dz*dz;
            
            if (distSq < r2) {
                const dist = Math.sqrt(distSq);
                let factor = 0;
                
                if (falloff === 'smooth') {
                    // Smoothstep falloff
                    const t = 1.0 - (dist / radius);
                    factor = t * t * (3.0 - 2.0 * t);
                } else {
                    factor = 1.0 - (dist / radius);
                }
                
                const push = factor * strength;
                v[i]   += direction.x * push;
                v[i+1] += direction.y * push;
                v[i+2] += direction.z * push;
            }
        }
        return geo;
    },

    /**
     * Wraps a geometry onto a sphere of given radius.
     * Useful for creating skull plates from planes.
     */
    spherify: (geo, radius, origin = {x:0, y:0, z:0}) => {
        const v = geo.vertices;
        for (let i = 0; i < v.length; i += 3) {
            const dx = v[i] - origin.x;
            const dy = v[i+1] - origin.y;
            const dz = v[i+2] - origin.z;
            
            // Normalize direction from origin
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (dist === 0) continue;
            
            // Project to sphere surface
            v[i]   = origin.x + (dx / dist) * radius;
            v[i+1] = origin.y + (dy / dist) * radius;
            v[i+2] = origin.z + (dz / dist) * radius;
            
            // Recalc normal (vector from origin)
            if (geo.normals) {
                geo.normals[i]   = dx / dist;
                geo.normals[i+1] = dy / dist;
                geo.normals[i+2] = dz / dist;
            }
        }
        return geo;
    }
};
