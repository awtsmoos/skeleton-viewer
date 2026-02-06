
// B"H
import { Builder } from '../Builder.js';

export const WallGen = {
    createBrickWall: () => Builder.build({
        type: 'grid',
        rows: 10, cols: 5,
        size: [5, 6], // Width, Height (mapped to Z/Y logic in grid? No grid is X/Z usually)
        // Let's implement a custom stack of rows for brick staggering
        // Or just use the raw grid and rely on shader.
        // Let's use simple Grid for now.
        type: 'group',
        parts: Array.from({length: 10}).map((_, y) => ({
            type: 'array', count: 5, step: { pos: [1.1, 0, 0] },
            item: { 
                type: 'cube', 
                pos: [-2.5 + ((y%2)*0.5), y*0.6, 0], 
                scale: [0.5, 0.25, 0.3] 
            }
        }))
    }),
    
    createWindowWall: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [-1.5, 1.5, 0], scale: [0.5, 1.5, 0.2] },
            { type: 'cube', pos: [1.5, 1.5, 0], scale: [0.5, 1.5, 0.2] },
            { type: 'cube', pos: [0, 3.2, 0], scale: [2.0, 0.2, 0.2] },
            { type: 'cube', pos: [0, -0.2, 0], scale: [2.0, 0.2, 0.2] },
            { type: 'plane', pos: [0, 1.5, 0], scale: [1.5, 1.5, 1] } // Glass
        ]
    }),

    createDoor: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [-0.6, 1.0, 0], scale: [0.1, 1.0, 0.15] },
            { type: 'cube', pos: [0.6, 1.0, 0], scale: [0.1, 1.0, 0.15] },
            { type: 'cube', pos: [0, 2.1, 0], scale: [0.7, 0.1, 0.15] },
            { type: 'cube', pos: [0, 1.0, 0], scale: [0.5, 1.0, 0.05] }, // Leaf
            { type: 'sphere', pos: [0.4, 0.9, 0.08], scale: [0.05, 0.05, 0.05] } // Knob
        ]
    }),

    createTiledFloor: () => Builder.build({
        type: 'grid', rows: 10, cols: 10, size: [10, 10],
        item: { type: 'cube', scale: [0.48, 0.05, 0.48] }
    }),

    createArchBridge: () => Builder.build({
        type: 'group',
        parts: Array.from({length: 20}).map((_, i) => {
            const t = i/20;
            return {
                type: 'cube',
                pos: [(t-0.5)*10, Math.sin(t*Math.PI)*2, 0],
                scale: [0.3, 0.1, 1.0]
            };
        })
    }),

    createSpiralStairs: () => Builder.build({
        type: 'group',
        parts: [
            { // Steps
                type: 'array', count: 20, 
                step: { pos: [0, 0.3, 0], rot: [0, 0.5, 0] },
                item: { type: 'cube', pos: [1.5, 0, 0], scale: [0.5, 0.05, 0.2] } // Offset X to spiral
            },
            { type: 'cube', pos: [0, 3, 0], scale: [0.2, 3, 0.2] } // Pole
        ]
    })
};
