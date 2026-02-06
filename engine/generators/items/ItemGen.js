
// B"H
import { Builder } from '../Builder.js';

export const ItemGen = {
    createPotion: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,0], scale: [0.3,0.3,0.3] },
            { type: 'cube', pos: [0,0.4,0], scale: [0.1,0.2,0.1] },
            { type: 'cube', pos: [0,0.6,0], scale: [0.12,0.05,0.12] }
        ]
    }),
    createScroll: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0,0,0], scale: [0.1,0.1,0.6] },
            { type: 'plane', pos: [0.2,0,0], scale: [0.3,1,0.5] }
        ]
    }),
    createBook: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0,0,0], scale: [0.5,0.1,0.7] },
            { type: 'cube', pos: [0.02,0,0], scale: [0.45,0.08,0.65] }
        ]
    }),
    createCandle: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0,0,0], scale: [0.1,0.5,0.1] },
            { type: 'cube', pos: [0,0.3,0], scale: [0.02,0.1,0.02] }, // Wick
            { type: 'sphere', pos: [0,0.45,0], scale: [0.05,0.1,0.05] } // Flame
        ]
    }),
    createTorahScroll: () => Builder.build({
        type: 'group',
        parts: [
            // Left Roller
            { type: 'cube', pos: [-0.4,0,0], scale: [0.1,0.1,1.2] },
            { type: 'sphere', pos: [-0.4,0,-1.2], scale: [0.2,0.2,0.1] },
            { type: 'sphere', pos: [-0.4,0,1.2], scale: [0.2,0.2,0.1] },
            { type: 'cube', pos: [-0.4,0,0], scale: [0.25,0.25,0.9] },
            // Right Roller
            { type: 'cube', pos: [0.4,0,0], scale: [0.1,0.1,1.2] },
            { type: 'sphere', pos: [0.4,0,-1.2], scale: [0.2,0.2,0.1] },
            { type: 'sphere', pos: [0.4,0,1.2], scale: [0.2,0.2,0.1] },
            { type: 'cube', pos: [0.4,0,0], scale: [0.25,0.25,0.9] },
            // Parchment
            { type: 'plane', pos: [0,0.25,0], scale: [0.4,1.0,0.9] }
        ]
    }),
    createMezuzah: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0,0,0], scale: [0.1,0.4,0.05] }, // Case
            // Shin
            { type: 'cube', pos: [0,0.1,0.06], scale: [0.06,0.08,0.02] },
            { type: 'cube', pos: [-0.05,0.12,0.06], scale: [0.02,0.08,0.02] },
            { type: 'cube', pos: [0.05,0.12,0.06], scale: [0.02,0.08,0.02] }
        ]
    })
};
