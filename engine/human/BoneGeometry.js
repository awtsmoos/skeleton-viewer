// B"H
import { LoftEngine } from '../geometry/LoftEngine.js';
import { Primitives } from '../generators/Primitives.js';
import { GeoUtils } from '../generators/GeoUtils.js';
import { CSG } from '../geometry/CSG.js';

/**
 * BoneGeometry: The Artisan of Separate Vessels.
 * Defines the mathematical form of each bone in the sacred manifest.
 */
export const BoneGeometry = {
    
    createJoint: (bone) => {
        // We keep the head hollow by silencing joint spheres for cranial bones
        if (['cranial', 'facial', 'cranial_base'].includes(bone.type)) return null;
        
        let r = 0.012;
        if (bone.radius) r = (Array.isArray(bone.radius) ? bone.radius[0] : bone.radius) * 1.1;
        return GeoUtils.transform(Primitives.createSphere(8,8), 0,0,0, r, r, r);
    },

    create: (bone, end) => {
        const type = bone.type || "";
        if (type === 'cranial') return BoneGeometry.createSkullPlate(bone);
        if (type === 'facial' || type === 'cranial_base') {
            const face = BoneGeometry.createSkullFaceBone(bone);
            if (face) return face;
        }
        
        if (type.match(/lumbar|thoracic|cervical/)) return BoneGeometry.createVertebra(bone);
        if (bone.id === 'sacrum' || bone.id === 'coccyx') return BoneGeometry.createPelvisPart(bone);
        if (type === 'rib') return BoneGeometry.createRib(bone);
        if (type === 'sternum') return BoneGeometry.createSternum(bone);
        if (type === 'pelvis' || type === 'pelvis_girdle') return BoneGeometry.createPelvisPart(bone);
        if (bone.id.includes('scapula')) return BoneGeometry.createScapula(bone);

        return BoneGeometry.createShaft(bone, end);
    },

    createShaft: (bone, end) => {
        if (!end || (end.x===0 && end.y===0 && end.z===0)) return null;
        let r1 = (bone.radius && Array.isArray(bone.radius) ? bone.radius[0] : bone.radius) || 0.015;
        let r2 = (bone.radius && Array.isArray(bone.radius) ? bone.radius[1] : r1*0.8) || 0.012;
        const points = [{x:0, y:0, z:0}, {x: end.x, y: end.y, z: end.z}];
        return LoftEngine.loftPath(points, [r1*1.3, r2*1.3], 8);
    },

    createSkullPlate: (bone) => {
        const id = bone.id;
        const res = (id === 'frontal') ? 160 : 100;
        let thetaRange = [-Math.PI, Math.PI];
        let phiRange = [-Math.PI/2, Math.PI/2];
        const deg = Math.PI / 180;

        if (id === 'frontal') {
            thetaRange = [-58 * deg, 58 * deg];
            phiRange = [-42 * deg, 84 * deg];
        } else if (id === 'parietal_l') {
            thetaRange = [-146 * deg, -54 * deg];
            phiRange = [12 * deg, 90 * deg];
        } else if (id === 'parietal_r') {
            thetaRange = [54 * deg, 146 * deg];
            phiRange = [12 * deg, 90 * deg];
        } else if (id === 'occipital') {
            thetaRange = [144 * deg, 216 * deg]; 
            phiRange = [-40 * deg, 66 * deg];
        } else if (id.includes('temporal')) {
            const side = id.includes('_l') ? -1 : 1;
            thetaRange = side === -1 ? [-146 * deg, -54 * deg] : [54 * deg, 146 * deg];
            phiRange = [-52 * deg, 12 * deg];
        }

        const vertices = []; const normals = []; const indices = [];
        const tStart = thetaRange[0], tEnd = thetaRange[1];
        const pStart = phiRange[0], pEnd = phiRange[1];

        for(let i=0; i<=res; i++) {
            const v = i/res;
            const phi = pStart + v * (pEnd - pStart);
            for(let j=0; j<=res; j++) {
                const u = j/res;
                const theta = tStart + u * (tEnd - tStart);
                
                let radius = 0.105;
                const cosT = Math.cos(theta);
                const sinT = Math.abs(Math.sin(theta));
                const backBias = cosT < -0.1 ? 1.08 : 1.0;
                const sideBias = sinT > 0.8 ? 0.92 : 1.0;
                const frontBias = cosT > 0.4 ? 0.95 : 1.0;
                radius *= backBias * sideBias * frontBias;

                let x = Math.sin(theta) * Math.cos(phi) * radius;
                let y = Math.sin(phi) * radius;
                let z = Math.cos(theta) * Math.cos(phi) * radius;
                
                const carved = CSG.carveAnatomy(x, y + 1.7, z);
                x = carved.pos.x;
                y = carved.pos.y - 1.7;
                z = carved.pos.z;
                
                vertices.push(x, y, z);
                const mag = Math.sqrt(x*x + y*y + z*z) || 1;
                normals.push(x/mag, y/mag, z/mag);
            }
        }
        
        const vStride = res + 1;
        const getV = (idx) => ({ x: vertices[idx*3], y: vertices[idx*3+1] + 1.7, z: vertices[idx*3+2] });

        for(let i=0; i<res; i++) {
            for(let j=0; j<res; j++) {
                const a = i * vStride + j;
                const b = a + 1;
                const c = (i+1) * vStride + j;
                const d = c + 1;
                
                if (CSG.carveAnatomy(getV(a).x, getV(a).y, getV(a).z).isVoid) continue;
                if (CSG.carveAnatomy(getV(b).x, getV(b).y, getV(b).z).isVoid) continue;
                if (CSG.carveAnatomy(getV(c).x, getV(c).y, getV(c).z).isVoid) continue;
                if (CSG.carveAnatomy(getV(d).x, getV(d).y, getV(d).z).isVoid) continue;

                indices.push(a, c, b);
                indices.push(b, c, d);
            }
        }

        return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint32Array(indices) };
    },

    createSkullFaceBone: (bone) => {
        const id = bone.id;
        if (id === 'mandible') {
            const path = [
                {x: -0.05, y: 0.04, z: -0.05}, {x: -0.055, y: -0.04, z: -0.04}, {x: -0.04, y: -0.065, z: 0.06},
                {x: 0, y: -0.075, z: 0.08}, {x: 0.04, y: -0.065, z: 0.06}, {x: 0.055, y: -0.04, z: -0.04}, {x: 0.05, y: 0.04, z: -0.05}
            ];
            return LoftEngine.loftPath(path, [0.006, 0.012, 0.015, 0.018, 0.015, 0.012, 0.006], 12);
        }
        return null;
    },

    createVertebra: (bone) => {
        const s = (bone.size && bone.size[0]) || 0.04;
        const h = (bone.size && bone.size[1]) || 0.03;
        const body = LoftEngine.loftPath([{x:0,y:-h/2,z:0}, {x:0,y:h/2,z:0}], s*0.6, 8);
        const spine = LoftEngine.loftPath([{x:0,y:0,z:-s*0.5}, {x:0,y:-h*0.5,z:-s*1.1}], [s*0.15, s*0.05], 4);
        return GeoUtils.merge([body, spine]);
    },
    
    createRib: (bone) => {
        const c = bone.curve || {x:0.15, y:-0.05, z:0.15};
        const side = bone.id.includes('_r') ? 1 : -1;
        const pts = [];
        for(let i=0; i<=10; i++) {
            const t = i/10; const angle = t * Math.PI * 0.75; 
            pts.push({ x: Math.sin(angle)*Math.abs(c.x)*1.5*side, y: t*c.y, z: (1.0-Math.cos(angle))*c.z*2.0 });
        }
        return LoftEngine.loftPath(pts, 0.007, 6);
    },
    createSternum: () => LoftEngine.loftPath([{x:0,y:0.05,z:0}, {x:0,y:-0.05,z:0}], [0.018, 0.014], 6),
    createPelvisPart: () => LoftEngine.loftPath([{x:0,y:0,z:0}, {x:0.02,y:0.06,z:0.03}, {x:-0.02,y:0.08,z:0}], [0.04, 0.05, 0.06], 8),
    createScapula: () => GeoUtils.transform(Primitives.createPlane(2), 0,0,0, 0.07, 0.12, 1)
};
