
// B"H
import { Builder } from '../Builder.js';

export const WeaponGen = {
    createBroadsword: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 0.8, 0], scale: [0.1, 0.8, 0.05] }, // Blade
            { type: 'cube', pos: [0, 0, 0], scale: [0.3, 0.05, 0.1] }, // Guard
            { type: 'cube', pos: [0, -0.3, 0], scale: [0.08, 0.3, 0.08] } // Handle
        ]
    }),
    createRoundShield: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'sphere', pos: [0,0,0], scale: [1.0, 0.2, 1.0] },
            { type: 'sphere', pos: [0, 0.15, 0], scale: [0.3, 0.1, 0.3] }
        ]
    }),
    createWizardStaff: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 0, 0], scale: [0.05, 2.0, 0.05] },
            { type: 'sphere', pos: [0, 2.0, 0], scale: [0.15, 0.15, 0.15] }
        ]
    }),
    createBow: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 0, 0], scale: [0.05, 0.2, 0.05] }, // Grip
            { type: 'cube', pos: [0, 0.4, 0.2], scale: [0.05, 0.4, 0.05] }, // Upper
            { type: 'cube', pos: [0, -0.4, 0.2], scale: [0.05, 0.4, 0.05] } // Lower
        ]
    })
};
