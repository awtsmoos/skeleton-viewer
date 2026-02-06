
// B"H
import { Builder } from '../Builder.js';
import { Primitives } from '../Primitives.js';

export const SciFiGen = {
    createWarpTunnel: () => Builder.build({
        type: 'ring', count: 16, radius: 10,
        item: { type: 'cube', scale: [1, 1, 100], pos: [0, 0, 0] }
    }),

    createHologram: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0, 1.7, 0], scale: [0.25, 0.25, 0.25] },
            { type: 'cube', pos: [0, 1.0, 0], scale: [0.4, 0.6, 0.2] }
        ]
    }),

    createForceField: () => Primitives.createSphere(32, 32),

    createLightSword: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, -0.5, 0], scale: [0.05, 0.2, 0.05] },
            { type: 'cube', pos: [0, 0.5, 0], scale: [0.03, 0.8, 0.03] }
        ]
    }),

    createDeathStation: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,0], scale: [10,10,10] },
            { type: 'sphere', pos: [4, 6, 4], scale: [3, 0.5, 3] } // Dish
        ]
    }),

    createMechWalker: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 3, 0], scale: [1.5, 1.2, 1.5] }, // Cockpit
            { type: 'cube', pos: [-1.8, 3, 0.5], scale: [0.3, 0.3, 1.0] }, // Gun L
            { type: 'cube', pos: [1.8, 3, 0.5], scale: [0.3, 0.3, 1.0] }, // Gun R
            // Legs
            { type: 'group', parts: [
                { type: 'cube', pos: [-1.5, 2, 0], scale: [0.4, 1.0, 0.4] },
                { type: 'cube', pos: [-1.5, 0.5, -1], scale: [0.3, 1.5, 0.3] },
                { type: 'cube', pos: [-1.5, 0, 0.5], scale: [0.6, 0.2, 1.0] }
            ]},
            { type: 'group', parts: [
                { type: 'cube', pos: [1.5, 2, 0], scale: [0.4, 1.0, 0.4] },
                { type: 'cube', pos: [1.5, 0.5, -1], scale: [0.3, 1.5, 0.3] },
                { type: 'cube', pos: [1.5, 0, 0.5], scale: [0.6, 0.2, 1.0] }
            ]}
        ]
    }),
    
    createCyberneticArm: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,0], scale: [0.15,0.15,0.15] },
            { type: 'cube', pos: [0,-0.3,0], scale: [0.08,0.25,0.08] },
            { type: 'sphere', pos: [0,-0.6,0], scale: [0.12,0.12,0.12] },
            { type: 'cube', pos: [-0.04,-0.9,0], scale: [0.03,0.25,0.03] },
            { type: 'cube', pos: [0.04,-0.9,0], scale: [0.03,0.25,0.03] },
            { type: 'cube', pos: [0,-1.2,0], scale: [0.1,0.1,0.05] }
        ]
    })
};
