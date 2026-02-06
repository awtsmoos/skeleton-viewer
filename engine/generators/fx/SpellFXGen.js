// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const SpellFXGen = {
    createMagicCircle: () => {
        const geos = [];
        const ring = Primitives.createSphere(16, 16); // Flattened to torus-ish
        
        // Concentric Rings
        geos.push(GeoUtils.transform(ring, 0,0,0, 2.0, 0.05, 2.0));
        geos.push(GeoUtils.transform(ring, 0,0,0, 1.5, 0.05, 1.5));
        
        // Runes (represented by small cubes)
        const runes = 8;
        for(let i=0; i<runes; i++) {
            const theta = (i/runes) * Math.PI * 2;
            const x = Math.cos(theta) * 1.75;
            const z = Math.sin(theta) * 1.75;
            geos.push(GeoUtils.transform(Primitives.createCube(), x, 0, z, 0.1, 0.1, 0.1));
        }
        return GeoUtils.merge(geos);
    },

    createShockwave: () => {
        // Dome + Ring
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createSphere(16,16), 0,0,0, 1.0, 0.5, 1.0)); // Hemisphere
        geos.push(GeoUtils.transform(Primitives.createSphere(16,16), 0,0,0, 1.5, 0.1, 1.5)); // Ring
        return GeoUtils.merge(geos);
    },
    
    createChaosOrb: () => {
        // Spiky chaotic sphere
        const geos = [];
        geos.push(Primitives.createSphere(12,12));
        for(let i=0; i<20; i++) {
            const rx = Math.random()*360;
            const ry = Math.random()*360;
            // We simulate rotation by random translation for now in this simple engine
            // Or just random cubes sticking out
            const x = (Math.random()-0.5);
            const y = (Math.random()-0.5);
            const z = (Math.random()-0.5);
            geos.push(GeoUtils.transform(Primitives.createPyramid(), x,y,z, 0.2, 1.5, 0.2));
        }
        return GeoUtils.merge(geos);
    }
};
