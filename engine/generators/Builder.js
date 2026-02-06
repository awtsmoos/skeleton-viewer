// B"H
import { Primitives } from './Primitives.js';
import { GeoUtils } from './GeoUtils.js';

export const Builder = {
    // Main Entry Point
    build: (schema) => {
        if (!schema) return null;
        if (Array.isArray(schema)) return GeoUtils.merge(schema.map(Builder.build).filter(g => g));

        const type = schema.type || 'cube';
        
        // 1. Composite Types
        if (type === 'group') {
            return GeoUtils.merge((schema.parts || []).map(Builder.build).filter(g => g));
        }
        
        if (type === 'array' || type === 'stack') {
            const parts = [];
            const count = schema.count || 1;
            const step = schema.step || {};
            for(let i=0; i<count; i++) {
                const item = JSON.parse(JSON.stringify(schema.item)); // Deep copy blueprint
                // Apply step offset
                item.pos = add(item.pos, mul(step.pos || step, i));
                item.rot = add(item.rot, mul(step.rot, i));
                item.scale = add(item.scale || [1,1,1], mul(step.scale, i));
                parts.push(Builder.build(item));
            }
            return GeoUtils.merge(parts);
        }

        if (type === 'ring') {
            const parts = [];
            const count = schema.count || 8;
            const radius = schema.radius || 1;
            for(let i=0; i<count; i++) {
                const theta = (i/count) * Math.PI * 2;
                const x = Math.cos(theta) * radius;
                const z = Math.sin(theta) * radius;
                
                const item = JSON.parse(JSON.stringify(schema.item));
                // Inject transform
                item.pos = add(item.pos, [x, 0, z]);
                if (schema.align) {
                    const existingRot = item.rot || [0,0,0];
                    item.rot = [existingRot[0], existingRot[1] - theta, existingRot[2]];
                }
                parts.push(Builder.build(item));
            }
            return GeoUtils.merge(parts);
        }

        if (type === 'grid') {
            const parts = [];
            const rows = schema.rows || 1;
            const cols = schema.cols || 1;
            const size = schema.size || [10, 10]; 
            const spacingX = size[0] / Math.max(1, cols); 
            const spacingZ = size[1] / Math.max(1, rows);
            
            for(let x=0; x<cols; x++) {
                for(let z=0; z<rows; z++) {
                    const item = JSON.parse(JSON.stringify(schema.item));
                    // Center grid
                    const px = (x - cols/2 + 0.5) * spacingX;
                    const pz = (z - rows/2 + 0.5) * spacingZ;
                    
                    // Jitter
                    const j = schema.jitter || 0;
                    const jx = (Math.random()-0.5)*j;
                    const jz = (Math.random()-0.5)*j;

                    item.pos = add(item.pos, [px+jx, 0, pz+jz]);
                    parts.push(Builder.build(item));
                }
            }
            return GeoUtils.merge(parts);
        }

        // 2. Primitives
        let geo;
        const pFunc = Primitives[`create${capitalize(type)}`] || Primitives.createCube;
        
        // Pass args if needed
        if (type === 'sphere') geo = pFunc(schema.seg || 16, schema.seg || 16);
        else if (type === 'plane') geo = pFunc(schema.seg || 1);
        else geo = pFunc();

        // 3. Transform
        const p = parseVal(schema.pos, [0,0,0]);
        const r = parseVal(schema.rot, [0,0,0]); 
        const s = parseVal(schema.scale, [1,1,1]);
        
        if (r[0]!==0 || r[1]!==0 || r[2]!==0) {
            rotateGeo(geo, r);
        }

        return GeoUtils.transform(geo, p[0], p[1], p[2], s[0], s[1], s[2]);
    }
};

// --- Helpers ---
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const parseVal = (v, def) => Array.isArray(v) ? v : def;
const add = (a, b) => {
    const A = a || [0,0,0];
    const B = b || [0,0,0];
    return [A[0]+B[0], A[1]+B[1], A[2]+B[2]];
};
const mul = (a, s) => {
    const A = a || [0,0,0];
    if (typeof s === 'number') return [A[0]*s, A[1]*s, A[2]*s];
    const S = s || [0,0,0];
    return [A[0]*S[0], A[1]*S[1], A[2]*S[2]];
};

const rotateGeo = (geo, rot) => {
    const cr = Math.cos(rot[0]), sr = Math.sin(rot[0]);
    const cp = Math.cos(rot[1]), sp = Math.sin(rot[1]);
    const cy = Math.cos(rot[2]), sy = Math.sin(rot[2]);

    for(let i=0; i<geo.vertices.length; i+=3) {
        let x = geo.vertices[i];
        let y = geo.vertices[i+1];
        let z = geo.vertices[i+2];

        // X Axis
        let y1 = y*cr - z*sr;
        let z1 = y*sr + z*cr;
        y=y1; z=z1;

        // Y Axis
        let x1 = x*cp + z*sp;
        z1 = -x*sp + z*cp;
        x=x1; z=z1;

        // Z Axis
        x1 = x*cy - y*sy;
        y1 = x*sy + y*cy;
        x=x1; y=y1;

        geo.vertices[i] = x;
        geo.vertices[i+1] = y;
        geo.vertices[i+2] = z;
        
        if (geo.normals) {
            let nx = geo.normals[i], ny = geo.normals[i+1], nz = geo.normals[i+2];
            let ny1 = ny*cr - nz*sr;
            let nz1 = ny*sr + nz*cr;
            ny=ny1; nz=nz1;
            let nx1 = nx*cp + nz*sp;
            nz1 = -nx*sp + nz*cp;
            nx=nx1; nz=nz1;
            nx1 = nx*cy - ny*sy;
            ny1 = nx*sy + ny*cy;
            nx=nx1; ny=ny1;
            geo.normals[i]=nx; geo.normals[i+1]=ny; geo.normals[i+2]=nz;
        }
    }
};
