// B"H
import { Primitives } from './Primitives.js';
import { GeoUtils } from './GeoUtils.js';
import { CreatureGen } from './bio/CreatureGen.js';
import { SkeletonGen } from './bio/SkeletonGen.js';

export const BioGen = {
    createDNA: () => {
        const geos = [];
        const sphere = Primitives.createSphere(8,8);
        for(let i=0; i<20; i++) {
            const t = i/20 * Math.PI * 4;
            geos.push(GeoUtils.transform(sphere, Math.cos(t), i*0.5, Math.sin(t), 0.2, 0.2, 0.2));
            geos.push(GeoUtils.transform(sphere, Math.cos(t+Math.PI), i*0.5, Math.sin(t+Math.PI), 0.2, 0.2, 0.2));
        }
        return GeoUtils.merge(geos);
    },
    createVirus: CreatureGen.createInsect, 
    createSkeleton: SkeletonGen.createRibCage
};
