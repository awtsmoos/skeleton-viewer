// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { TechGen } from '../TechGen.js'; 

export const LayoutGen = {
    createTunnel: (blueprint = {}) => {
        const geos = [];
        const type = blueprint.segmentType || 'microchip';
        const radius = blueprint.radius || 10;
        const length = blueprint.length || 50;
        const density = blueprint.density || 0.5; 
        
        const count = Math.floor(length * density * 10); 
        
        for(let i=0; i<count; i++) {
            const t = i / count; 
            const z = -t * length; 
            const angle = t * Math.PI * 20.0; 
            const r = radius + Math.sin(t * 10.0) * 2.0; 
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            
            let geo;
            if (type === 'microchip') geo = TechGen.createMicrochip();
            else geo = Primitives.createCube();
            
            const s = 1.0 + Math.random() * 0.5;
            geos.push(GeoUtils.transform(geo, x, y, z, s, s, s));
        }
        return GeoUtils.merge(geos);
    },

    createHorizonBurst: (blueprint = {}) => {
        const geos = [];
        const core = Primitives.createSphere(16,16);
        geos.push(GeoUtils.transform(core, 0, 0, 0, 5, 5, 5));
        const rayCount = 12;
        for(let i=0; i<rayCount; i++) {
            const theta = (i/rayCount) * Math.PI * 2;
            const xDir = Math.cos(theta);
            const yDir = Math.sin(theta);
            for(let k=1; k<15; k++) {
                const dist = k * 4.0;
                const obj = Primitives.createCube();
                const s = 1.0 + (k * 0.2);
                geos.push(GeoUtils.transform(obj, xDir * dist, yDir * dist, 0, s, s, s));
                if (k > 1) {
                    const line = Primitives.createCube();
                    const prevDist = (k-1) * 4.0;
                    const mx = xDir * (dist + prevDist)/2;
                    const my = yDir * (dist + prevDist)/2;
                    geos.push(GeoUtils.transform(line, mx, my, 0, 0.1, 0.1, 2.0));
                }
            }
        }
        return GeoUtils.merge(geos);
    },
    
    createGrid: (blueprint = {}) => {
        const geos = [];
        const rows = 20; 
        const cols = 20;
        const spacing = 2.0;
        const base = Primitives.createCube();
        for(let x=0; x<cols; x++) {
            for(let z=0; z<rows; z++) {
                const px = (x - cols/2) * spacing;
                const pz = (z - rows/2) * spacing;
                const py = Math.sin(x*0.5)*Math.cos(z*0.5) * 2.0;
                geos.push(GeoUtils.transform(base, px, py, pz, 1, 1, 1));
            }
        }
        return GeoUtils.merge(geos);
    }
};
