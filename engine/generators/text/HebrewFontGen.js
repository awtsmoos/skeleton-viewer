
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

const ALEPH_BET = {
    'aleph': [
        // Diagonal Vav
        { x: 0, y: 0, z: 0, sx: 0.15, sy: 0.8, sz: 0.1, rx: 0, ry: 0, rz: 0.7 },
        // Upper Yud
        { x: 0.2, y: 0.3, z: 0, sx: 0.15, sy: 0.2, sz: 0.1, rx: 0, ry: 0, rz: 0 },
        // Lower Yud
        { x: -0.2, y: -0.3, z: 0, sx: 0.15, sy: 0.2, sz: 0.1, rx: 0, ry: 0, rz: 0 }
    ],
    'bet': [
        { x: 0, y: -0.4, z: 0, sx: 0.8, sy: 0.1, sz: 0.1 }, // Base
        { x: 0.35, y: 0, z: 0, sx: 0.1, sy: 0.8, sz: 0.1 }, // Right
        { x: 0, y: 0.4, z: 0, sx: 0.8, sy: 0.1, sz: 0.1 }   // Top
    ],
    'gimel': [
        { x: 0.2, y: 0, z: 0, sx: 0.1, sy: 0.8, sz: 0.1 }, // Vertical
        { x: 0, y: -0.4, z: 0, sx: 0.4, sy: 0.1, sz: 0.1, rx: 0, ry: 0, rz: 0.5 } // Leg
    ],
    'shin': [
        { x: 0, y: -0.4, z: 0, sx: 0.8, sy: 0.1, sz: 0.1 }, // Base
        { x: -0.3, y: 0, z: 0, sx: 0.1, sy: 0.8, sz: 0.1, rx: 0, ry: 0, rz: -0.2 }, // Left
        { x: 0.3, y: 0, z: 0, sx: 0.1, sy: 0.8, sz: 0.1, rx: 0, ry: 0, rz: 0.2 }, // Right
        { x: 0, y: 0, z: 0, sx: 0.1, sy: 0.8, sz: 0.1 } // Center
    ]
};

export const HebrewFontGen = {
    createLetter: (charName = 'aleph') => {
        const geos = [];
        const parts = ALEPH_BET[charName.toLowerCase()] || ALEPH_BET['aleph'];
        const cube = Primitives.createCube();
        
        parts.forEach(p => {
            // We need a transform that supports rotation. 
            // GeoUtils.transform is limited to Scale/Translate.
            // We simulate rotation by permuting vertices or just assume simple shapes.
            // For true rotation, we'd need a matrix calc here. 
            // Workaround: Use existing rotation support in SceneObject at runtime, 
            // OR implement simple Z-rotation here for the mesh generation.
            
            // Simple Z-Rotation manual implementation for generation
            const c = Math.cos(p.rz || 0);
            const s = Math.sin(p.rz || 0);
            
            const tempGeo = GeoUtils.transform(cube, 0,0,0, p.sx, p.sy, p.sz);
            
            // Rotate vertices manually
            for(let i=0; i<tempGeo.vertices.length; i+=3) {
                const x = tempGeo.vertices[i];
                const y = tempGeo.vertices[i+1];
                tempGeo.vertices[i] = x * c - y * s;
                tempGeo.vertices[i+1] = x * s + y * c;
            }
            
            // Translate
            for(let i=0; i<tempGeo.vertices.length; i+=3) {
                tempGeo.vertices[i] += p.x;
                tempGeo.vertices[i+1] += p.y;
                tempGeo.vertices[i+2] += p.z;
            }
            
            geos.push(tempGeo);
        });
        
        return GeoUtils.merge(geos);
    }
};
