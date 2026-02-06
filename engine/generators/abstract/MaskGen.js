
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const MaskGen = {
    // A jagged rift shape for "Tearing the Sky"
    createSkyTear: () => {
        const geos = [];
        const segments = 20;
        const width = 0.5;
        const height = 4.0;
        
        // Use a plane but displace vertices to make it jagged
        // Since we don't have vertex access easily in 'Primitives.createPlane', we build from quads/triangles
        // Or we use many small cubes to form the jagged edge
        
        // Better: Use a high-res plane and the shader will discard/alpha based on noise.
        // But for stencil writing, we need actual GEOMETRY to fill the depth/stencil buffer.
        
        // Let's create a "Almond" shape made of jagged triangles.
        // Central spine
        for(let i=0; i<segments; i++) {
            const t = i/segments;
            // Width varies (sine wave envelope)
            const w = Math.sin(t * Math.PI) * width;
            
            // Random jaggedness
            const jagL = (Math.random() * 0.2) * w;
            const jagR = (Math.random() * 0.2) * w;
            
            const y = (t - 0.5) * height;
            
            // Slice
            geos.push(GeoUtils.transform(Primitives.createCube(), 0, y, 0, w + jagL + jagR, height/segments, 0.1));
        }
        
        return GeoUtils.merge(geos);
    },
    
    // A dynamic "Hole" that can expand
    createCirclePortal: () => {
        // High res flattened cylinder
        return GeoUtils.transform(Primitives.createSphere(32,32), 0,0,0, 1, 0.01, 1);
    }
};
