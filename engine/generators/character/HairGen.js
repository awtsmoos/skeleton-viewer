// B"H
import { GeoUtils } from '../GeoUtils.js';
import { LoftEngine } from '../../geometry/LoftEngine.js';

export const HairGen = {
    /**
     * Creates a full head of hair with individual strands
     */
    createStrandHair: () => {
        const strands = [];
        const count = 1500;
        const headRadius = 0.11;
        const headCenter = { x: 0, y: 1.75, z: 0 };
        
        for (let i = 0; i < count; i++) {
            // Root on scalp (upper hemisphere)
            const phi = Math.random() * Math.PI * 2;
            const costheta = Math.random() * 0.7 + 0.3; 
            const theta = Math.acos(costheta);
            
            const root = {
                x: headCenter.x + headRadius * Math.sin(theta) * Math.cos(phi),
                y: headCenter.y + headRadius * Math.cos(theta),
                z: headCenter.z + headRadius * Math.sin(theta) * Math.sin(phi)
            };
            
            const strandLength = 0.1 + Math.random() * 0.2;
            const segments = 5;
            const path = [root];
            let current = { ...root };

            for (let j = 0; j < segments; j++) {
                // Gravity
                current.y -= strandLength / segments * 0.8;
                // Push out from head center to avoid clipping
                const fromCenter = {x: current.x - headCenter.x, y: current.y - headCenter.y, z: current.z - headCenter.z};
                const dist = Math.sqrt(fromCenter.x**2 + fromCenter.y**2 + fromCenter.z**2);
                const pushOut = (headRadius - dist) * 0.5;
                if(dist > 0) {
                    current.x += (fromCenter.x / dist) * pushOut;
                    current.y += (fromCenter.y / dist) * pushOut;
                    current.z += (fromCenter.z / dist) * pushOut;
                }
                
                path.push({ ...current });
            }
            
            const radii = [0.0025, 0.002, 0.0018, 0.0015, 0.001, 0.0005];
            strands.push(LoftEngine.loftPath(path, radii, 4));
        }

        return GeoUtils.merge(strands);
    },

    createBeard: () => {
        const strands = [];
        const count = 800;
        
        for(let i=0; i<count; i++) {
            const y = 1.52 + Math.random() * 0.08;
            const z = 0.08 + Math.random() * 0.04;
            const x = (Math.random() - 0.5) * 0.14;

            const root = {x, y, z};
            const path = [root];
            path.push({
                x: x + (Math.random()-0.5)*0.01,
                y: y - 0.05,
                z: z + (Math.random()-0.5)*0.01
            });
             path.push({
                x: x + (Math.random()-0.5)*0.02,
                y: y - 0.1,
                z: z + (Math.random()-0.5)*0.02
            });

            strands.push(LoftEngine.loftPath(path, [0.003, 0.002, 0.001], 4));
        }
        return GeoUtils.merge(strands);
    }
};