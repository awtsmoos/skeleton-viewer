
// B"H
import { Builder } from '../Builder.js';

export const CastleGen = {
    createTower: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 2, 0], scale: [1, 2, 1] }, // Base
            { // Crenellations
                type: 'ring', count: 4, radius: 1, 
                item: { type: 'cube', pos: [0, 4.2, 0], scale: [0.2, 0.2, 0.2] } 
            }
        ]
    }),
    
    createGate: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [-1.5, 2, 0], scale: [0.5, 2, 0.5] }, // Left
            { type: 'cube', pos: [1.5, 2, 0], scale: [0.5, 2, 0.5] }, // Right
            { type: 'cube', pos: [0, 3.5, 0], scale: [2.0, 0.5, 0.5] }, // Arch
            { // Bars
                type: 'array', count: 5, step: { pos: [0.5, 0, 0] },
                item: { type: 'cube', pos: [-1, 2, 0], scale: [0.1, 1.5, 0.1] }
            }
        ]
    })
};
