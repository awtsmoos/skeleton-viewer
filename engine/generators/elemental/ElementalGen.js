// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const ElementalGen = {
    createFireball: () => {
        // A sphere that will use the magma/fire shader
        // Maybe layer multiple spheres for core vs halo
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createSphere(12,12), 0,0,0, 0.5, 0.5, 0.5));
        geos.push(GeoUtils.transform(Primitives.createSphere(8,8), 0,0.2,0, 0.3, 0.6, 0.3)); // Tail
        return GeoUtils.merge(geos);
    },
    
    createIceShard: () => {
        // Spiky pyramid
        return GeoUtils.transform(Primitives.createPyramid(), 0,0,0, 0.2, 1.0, 0.2);
    },
    
    createEarthBoulder: () => {
        // Deformed cube
        const geos = [];
        geos.push(GeoUtils.transform(Primitives.createCube(), 0,0,0, 0.5, 0.5, 0.5));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0.3, 0.3, 0, 0.4, 0.4, 0.4));
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.2, -0.2, 0.2, 0.3, 0.3, 0.3));
        return GeoUtils.merge(geos);
    },
    
    createAirSwirl: () => {
        // Spiral of particles (simulated by small cubes)
        const geos = [];
        const part = Primitives.createCube();
        for(let i=0; i<20; i++) {
            const t = i/20 * Math.PI * 4;
            const x = Math.cos(t) * (i*0.1);
            const z = Math.sin(t) * (i*0.1);
            const y = i * 0.2;
            geos.push(GeoUtils.transform(part, x,y,z, 0.1, 0.05, 0.1));
        }
        return GeoUtils.merge(geos);
    }
};
