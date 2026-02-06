// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const HighMagicGen = {
    createElementalGolem: (elementType = 'rock') => {
        // A bulky humanoid made of spheres/cubes
        const geos = [];
        const core = (elementType === 'rock' || elementType === 'magma') ? Primitives.createCube() : Primitives.createSphere(8,8);
        
        // Torso
        geos.push(GeoUtils.transform(core, 0, 1.5, 0, 1.0, 0.8, 0.8));
        // Head (Small, tucked in)
        geos.push(GeoUtils.transform(core, 0, 2.4, 0.2, 0.4, 0.4, 0.4));
        
        // Arms (Asymmetric)
        geos.push(GeoUtils.transform(core, -1.2, 1.5, 0, 0.5, 1.2, 0.5)); // Left
        geos.push(GeoUtils.transform(core, 1.2, 1.0, 0, 0.6, 1.4, 0.6)); // Right (Larger)
        
        // Legs
        geos.push(GeoUtils.transform(core, -0.6, 0.0, 0, 0.5, 1.0, 0.6));
        geos.push(GeoUtils.transform(core, 0.6, 0.0, 0, 0.5, 1.0, 0.6));
        
        // Spikes for Ice
        if (elementType === 'ice') {
             const spike = Primitives.createPyramid();
             geos.push(GeoUtils.transform(spike, 0, 2.8, 0, 0.2, 0.8, 0.2)); // Head spike
             geos.push(GeoUtils.transform(spike, 1.5, 2.0, 0, 0.2, 1.0, 0.2)); // Shoulder
        }
        
        return GeoUtils.merge(geos);
    },

    createDarkTowerEye: () => {
        const geos = [];
        // Spire
        geos.push(GeoUtils.transform(Primitives.createPyramid(), 0, 5, 0, 2, 10, 2));
        // The Eye (Suspended)
        // Two curved planes or a flattened sphere
        const eye = Primitives.createSphere(16,16);
        geos.push(GeoUtils.transform(eye, 0, 10.5, 0, 0.8, 2.0, 0.2)); // Vertical slit shape
        return GeoUtils.merge(geos);
    },

    createRuneCircle: () => {
        // Floating stones in a circle
        const geos = [];
        const stone = Primitives.createCube();
        const count = 12;
        for(let i=0; i<count; i++) {
             const t = (i/count) * Math.PI * 2;
             const x = Math.cos(t) * 3.0;
             const z = Math.sin(t) * 3.0;
             geos.push(GeoUtils.transform(stone, x, 0.5, z, 0.3, 0.1, 0.2));
             // Floating bit
             geos.push(GeoUtils.transform(stone, x, 1.5 + Math.sin(i)*0.2, z, 0.1, 0.4, 0.1));
        }
        return GeoUtils.merge(geos);
    },

    createCrystalSpire: () => {
        const geos = [];
        const shard = Primitives.createPyramid();
        // Main Cluster
        geos.push(GeoUtils.transform(shard, 0, 0, 0, 1.0, 8.0, 1.0));
        // Outcroppings
        for(let i=0; i<6; i++) {
             const t = (i/6) * Math.PI * 2;
             const x = Math.cos(t) * 0.5;
             const z = Math.sin(t) * 0.5;
             geos.push(GeoUtils.transform(shard, x, 0, z, 0.4, 3.0, 0.4));
             // Floating bits
             geos.push(GeoUtils.transform(shard, x*4, 5+i, z*4, 0.2, 1.0, 0.2));
        }
        return GeoUtils.merge(geos);
    }
};
