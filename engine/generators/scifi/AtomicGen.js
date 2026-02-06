
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const AtomicGen = {
    createAtom: () => {
        const geos = [];
        const sphere = Primitives.createSphere(12,12);
        
        // Nucleus (Protons/Neutrons cluster)
        for(let i=0; i<5; i++) {
            const x = (Math.random()-0.5)*0.2;
            const y = (Math.random()-0.5)*0.2;
            const z = (Math.random()-0.5)*0.2;
            geos.push(GeoUtils.transform(sphere, x,y,z, 0.15, 0.15, 0.15));
        }
        
        // Electron Shells (Orbits)
        // Represented as rings or scattered electrons
        // We'll place electrons in orbit positions. 
        // Rotation happens in shader/logic usually, but here is static snapshot.
        const electrons = 8;
        for(let i=0; i<electrons; i++) {
            const angle = (i/electrons) * Math.PI * 2;
            const radius = 1.0;
            // Tilt orbits?
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            // Electron
            geos.push(GeoUtils.transform(sphere, x, 0, z, 0.05, 0.05, 0.05));
            // Orbit Ring (Points)
            for(let k=0; k<20; k++) {
                const t = (k/20) * Math.PI * 2;
                const rx = Math.cos(t) * radius;
                const rz = Math.sin(t) * radius;
                geos.push(GeoUtils.transform(sphere, rx, 0, rz, 0.01, 0.01, 0.01));
            }
        }
        
        return GeoUtils.merge(geos);
    },
    
    createMoleculeLattice: (size = 3) => {
        const geos = [];
        const atom = Primitives.createSphere(8,8);
        const bond = Primitives.createCube();
        
        // Grid
        for(let x=0; x<size; x++) {
            for(let y=0; y<size; y++) {
                for(let z=0; z<size; z++) {
                    // Atom
                    geos.push(GeoUtils.transform(atom, x,y,z, 0.2, 0.2, 0.2));
                    
                    // Bonds (X, Y, Z directions)
                    if (x < size-1) geos.push(GeoUtils.transform(bond, x+0.5, y, z, 0.5, 0.05, 0.05));
                    if (y < size-1) geos.push(GeoUtils.transform(bond, x, y+0.5, z, 0.05, 0.5, 0.05));
                    if (z < size-1) geos.push(GeoUtils.transform(bond, x, y, z+0.5, 0.05, 0.05, 0.5));
                }
            }
        }
        return GeoUtils.merge(geos);
    }
};
