
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { PropGen } from '../items/PropGen.js';
import { CosmosGen } from '../CosmosGen.js';
import { CharacterGen } from '../CharacterGen.js';
import { BookGen } from '../library/BookGen.js';

export const ComparisonLayout = {
    createSplitReality: (blueprint = {}) => {
        const geos = [];
        
        // 1. THE DIVIDER
        const beam = Primitives.createCube();
        geos.push(GeoUtils.transform(beam, 0, 10, 0, 0.5, 20, 20));
        
        // 2. LEFT SIDE: CHAOS
        for(let i=0; i<20; i++) {
            const x = -5 - Math.random() * 15;
            const y = Math.random() * 10;
            const z = (Math.random()-0.5) * 20;
            
            const isDark = Math.random() > 0.5;
            const obj = isDark ? PropGen.createBrokenRuler() : CosmosGen.createBlackHole();
            
            geos.push(GeoUtils.transform(obj, x, y, z, 1, 1, 1));
        }
        
        // 3. RIGHT SIDE: ORDER
        const chain = PropGen.createChainStrand(10);
        geos.push(GeoUtils.transform(chain, 10, 5, 0, 2, 2, 2));
        
        const crowd = CharacterGen.createHumanoid();
        geos.push(GeoUtils.transform(crowd, 15, 0, 5, 1, 1, 1));
        
        const scroll = BookGen.createBook(); 
        geos.push(GeoUtils.transform(scroll, 8, 2, -5, 2, 2, 2));

        return GeoUtils.merge(geos);
    }
};
