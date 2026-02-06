// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const FXGen = {
    createGlitchBlock: () => {
        const geos = [];
        // Random assortment of cubes
        for(let i=0; i<10; i++) {
             const x = (Math.random()-0.5)*2;
             const y = (Math.random()-0.5)*2;
             const z = (Math.random()-0.5)*2;
             geos.push(GeoUtils.transform(Primitives.createCube(), x,y,z, Math.random()*0.5, Math.random()*0.1, Math.random()*0.5));
        }
        return GeoUtils.merge(geos);
    },
    createVoxelExplosion: () => {
         // Just a placeholder for particle system emission source
         return Primitives.createSphere(4,4);
    }
};
