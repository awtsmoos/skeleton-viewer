// B"H
import { GeoUtils } from './GeoUtils.js';
import { Primitives } from './Primitives.js';
import { LoftEngine } from '../geometry/LoftEngine.js';
import { Eretz } from './Eretz.js';

export const AdamKadmon = {
    generate: () => {
        const bones = [];
        const skin = [];

        // 1. Calculate Birth Height (Center of world)
        const groundHeight = Eretz.getHeight(0, 0);
        const yBase = groundHeight * 1.0; // Scaled by ground transformation in renderer

        // 2. Torso Core (A unified column of life)
        const corePoints = [ 
            {x:0, y:yBase + 0.0, z:0}, 
            {x:0, y:yBase + 0.8, z:0.05}, 
            {x:0, y:yBase + 1.5, z:0}, 
            {x:0, y:yBase + 1.8, z:-0.05} 
        ];
        const coreRadii = [ 0.3, 0.4, 0.35, 0.15 ];
        skin.push(LoftEngine.loftPath(corePoints, coreRadii, 16));

        // 3. Legs (Woven into the core)
        const leg = (s) => {
            const p = [
                {x:s*0.2, y:yBase + 0.4, z:0}, 
                {x:s*0.2, y:yBase - 0.5, z:0.1}, 
                {x:s*0.2, y:yBase - 1.2, z:0}
            ];
            const r = [0.22, 0.16, 0.12];
            skin.push(LoftEngine.loftPath(p, r, 12));
            bones.push(LoftEngine.loftPath(p, [0.04, 0.04, 0.04], 4));
        };
        leg(-1); leg(1);

        // 4. Arms
        const arm = (s) => {
            const p = [
                {x:s*0.4, y:yBase + 1.6, z:0}, 
                {x:s*0.9, y:yBase + 1.5, z:0.1}, 
                {x:s*1.2, y:yBase + 1.3, z:0.3}
            ];
            const r = [0.12, 0.1, 0.08];
            skin.push(LoftEngine.loftPath(p, r, 10));
            bones.push(LoftEngine.loftPath(p, [0.03, 0.03, 0.03], 4));
        };
        arm(-1); arm(1);

        // 5. Head
        const headGeo = GeoUtils.transform(Primitives.createSphere(16,16), 0, yBase + 2.1, 0.05, 0.22, 0.28, 0.24);
        skin.push(headGeo);

        return {
            bones: GeoUtils.merge(bones),
            skin: LoftEngine.weld(skin, 0.04)
        };
    }
};