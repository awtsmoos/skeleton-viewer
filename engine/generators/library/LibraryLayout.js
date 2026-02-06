
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { BookGen } from './BookGen.js';

export const LibraryLayout = {
    createCosmicLibrary: (blueprint = {}) => {
        const geos = [];
        const spokes = 8;
        const length = 20;
        
        // Central Hub (Globe placeholder if merged, or empty space)
        
        // Spokes
        for(let i=0; i<spokes; i++) {
            const angle = (i/spokes) * Math.PI * 2;
            const dirX = Math.cos(angle);
            const dirZ = Math.sin(angle);
            
            for(let d=2; d<length; d+=1.5) {
                const x = dirX * d;
                const z = dirZ * d;
                
                // Floating Platforms
                geos.push(GeoUtils.transform(Primitives.createCube(), x, -1, z, 0.5, 0.1, 0.5));
                
                // Books floating above
                if (Math.random() > 0.5) {
                    const book = BookGen.createBook();
                    geos.push(GeoUtils.transform(book, x, 0 + Math.random(), z, 0.2, 0.2, 0.2));
                }
                
                // Screens
                if (Math.random() > 0.7) {
                    const screen = Primitives.createCube();
                    geos.push(GeoUtils.transform(screen, x, 1 + Math.random(), z, 0.4, 0.3, 0.05));
                }
            }
        }
        return GeoUtils.merge(geos);
    }
};
