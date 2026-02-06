// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const MerkabahGen = {
    create: () => {
        // Star Tetrahedron (Two interlaced tetrahedrons)
        const tetra = Primitives.createPyramid(); // Close enough for demo
        const geos = [];
        
        // Upward Pointing
        geos.push(GeoUtils.transform(tetra, 0,0,0, 1,1,1));
        
        // Downward Pointing (Inverted)
        // Manual rotation 180 on Z/X implies scale -1 on Y often works for simple geo
        geos.push(GeoUtils.transform(tetra, 0,0,0, 1,-1,1));
        
        return GeoUtils.merge(geos);
    }
};
