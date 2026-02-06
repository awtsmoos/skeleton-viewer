// B"H
/**
 * DEPRECATED: This is the old, primitive Golem-maker.
 * The new, hyper-realistic system is in `CharacterGen.js` and the `engine/human` modules.
 */
import { GeoUtils } from './GeoUtils.js';
import { Primitives } from './Primitives.js';
import { LoftEngine } from '../geometry/LoftEngine.js';

export const AnatomyGen = {
    generateHuman: () => {
        const bones = [];
        const skin = [];

        const yBase = 0;

        // Torso Core
        const corePoints = [ 
            {x:0, y:yBase + 0.8, z:0}, 
            {x:0, y:yBase + 1.5, z:0}, 
        ];
        const coreRadii = [ 0.35, 0.3 ];
        skin.push(LoftEngine.loftPath(corePoints, coreRadii, 16));

        // Legs
        const leg = (s) => {
            const p = [ {x:s*0.18, y:yBase + 0.85, z:0}, {x:s*0.2, y:yBase + 0.0, z:0} ];
            const r = [0.18, 0.1];
            skin.push(LoftEngine.loftPath(p, r, 12));
            bones.push(LoftEngine.loftPath(p, [0.04, 0.04], 4));
        };
        leg(-1); leg(1);

        // Arms
        const arm = (s) => {
            const p = [ {x:s*0.35, y:yBase + 1.45, z:0}, {x:s*0.7, y:yBase + 0.8, z:0} ];
            const r = [0.1, 0.08];
            skin.push(LoftEngine.loftPath(p, r, 10));
            bones.push(LoftEngine.loftPath(p, [0.03, 0.03], 4));
        };
        arm(-1); arm(1);

        // Head
        const headGeo = GeoUtils.transform(Primitives.createSphere(16,16), 0, yBase + 1.7, 0, 0.2, 0.22, 0.2);
        skin.push(headGeo);

        return {
            bones: GeoUtils.merge(bones),
            skin: LoftEngine.weld(skin, 0.04),
        };
    }
};