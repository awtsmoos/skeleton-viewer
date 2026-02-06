
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { CharacterGen } from '../CharacterGen.js';

export const CrowdGen = {
    // A block of static meshes that will be animated by the Vertex Shader
    createCrowdBlock: (count = 10) => {
        const geos = [];
        const human = CharacterGen.createHumanoid(); // Base mesh
        
        const size = Math.ceil(Math.sqrt(count));
        
        for(let i=0; i<count; i++) {
             const row = Math.floor(i / size);
             const col = i % size;
             
             // Jitter
             const jx = (Math.random()-0.5)*0.5;
             const jz = (Math.random()-0.5)*0.5;
             
             // Scale slightly varied
             const s = 0.9 + Math.random() * 0.2;
             
             geos.push(GeoUtils.transform(human, (col * 1.5) + jx, 0, (row * 1.5) + jz, s,s,s));
        }
        return GeoUtils.merge(geos);
    },
    
    // Creates a dense phalanx for battles
    createArmyPhalanx: (rows = 5, cols = 10) => {
        const geos = [];
        const human = CharacterGen.createHumanoid();
        const spear = Primitives.createCube();
        
        for(let z=0; z<rows; z++) {
            for(let x=0; x<cols; x++) {
                 geos.push(GeoUtils.transform(human, x*1.2, 0, z*1.5, 1,1,1));
                 // Spears pointing forward
                 geos.push(GeoUtils.transform(spear, x*1.2 + 0.3, 1.2, z*1.5 + 0.5, 0.05, 0.05, 2.5));
            }
        }
        return GeoUtils.merge(geos);
    },
    
    // Randomly distributed crowd for cities
    createCityCrowd: (count = 20, area = 20) => {
        const geos = [];
        const human = CharacterGen.createHumanoid();
        for(let i=0; i<count; i++) {
            const x = (Math.random() - 0.5) * area;
            const z = (Math.random() - 0.5) * area;
            // Random Y rotation is hard in merged geo without custom attributes,
            // but we can rotate the mesh vertices here roughly
            // For now, they all face forward, user relies on 'wandering' behavior shader or separate objects for rotation.
            // Wait, for TRUE low ram city, we merge them. They will all face same way.
            // If we want random facing, we must rotate vertices here.
            
            // NOTE: Ideally we'd use rotation matrices here. For simplicity in this engine:
            geos.push(GeoUtils.transform(human, x, 0, z, 1,1,1)); 
        }
        return GeoUtils.merge(geos);
    }
};
