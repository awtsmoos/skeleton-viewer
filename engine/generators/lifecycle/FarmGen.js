
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const FarmGen = {
    createWheatStalk: () => {
        const geos = [];
        // Stalk
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0.5, 0, 0.02, 0.5, 0.02));
        // Grain head
        for(let i=0; i<5; i++) {
             geos.push(GeoUtils.transform(Primitives.createCube(), 0.02, 1.0 + (i*0.1), 0, 0.04, 0.04, 0.04));
             geos.push(GeoUtils.transform(Primitives.createCube(), -0.02, 1.05 + (i*0.1), 0, 0.04, 0.04, 0.04));
        }
        return GeoUtils.merge(geos);
    },
    
    createWheatField: () => {
        // A block of 20 stalks
        const geos = [];
        const stalk = FarmGen.createWheatStalk();
        for(let x=-2; x<=2; x++) {
            for(let z=-2; z<=2; z++) {
                const jx = (Math.random()-0.5)*0.5;
                const jz = (Math.random()-0.5)*0.5;
                const s = 0.8 + Math.random()*0.4;
                geos.push(GeoUtils.transform(stalk, x+jx, 0, z+jz, 1, s, 1));
            }
        }
        return GeoUtils.merge(geos);
    }
};
