
// B"H
import { Builder } from '../Builder.js';
import { SkeletonGen } from './SkeletonGen.js';

export const CreatureGen = {
    createWhale: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,0], scale: [2.0, 1.5, 5.0] }, // Body
            { type: 'cube', pos: [0,0,-6], scale: [1.5, 0.2, 1.0] }, // Tail
            { type: 'cube', pos: [2,-0.5,1], scale: [1.5, 0.1, 0.8] }, // Fin R
            { type: 'cube', pos: [-2,-0.5,1], scale: [1.5, 0.1, 0.8] }, // Fin L
            // Skeleton internal
            // Note: SkeletonGen creates Scene Objects (with children), not Geometry. 
            // We can't merge it here simply with Builder. 
            // But if we want geometry of bones, we use SkeletonGen logic but ported to Builder?
            // Assuming CreatureGen returns merged geometry for static models.
        ]
    }),

    createInsect: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,1.5], scale: [0.4, 0.3, 0.4] }, // Head
            { type: 'sphere', pos: [0,0,0.8], scale: [0.5, 0.4, 0.5] }, // Thorax
            { type: 'sphere', pos: [0,0,-0.5], scale: [0.6, 0.5, 1.0] }, // Abdomen
            // Legs Right
            { type: 'array', count: 3, step: { pos: [0,0,-0.8] }, 
              item: { type: 'cube', pos: [0.6, -0.2, 1.0], scale: [1, 0.1, 0.1] } }, // Simplified leg
            // Legs Left
            { type: 'array', count: 3, step: { pos: [0,0,-0.8] }, 
              item: { type: 'cube', pos: [-0.6, -0.2, 1.0], scale: [1, 0.1, 0.1] } }
        ]
    }),

    createDragon: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,0], scale: [1, 0.8, 2] },
            { type: 'plane', pos: [2, 1, 0], scale: [3, 1, 2] }, // Wings
            { type: 'plane', pos: [-2, 1, 0], scale: [3, 1, 2] }
        ]
    })
};
