
// B"H
import { Builder } from '../Builder.js';

export const FurnitureGen = {
    createThrone: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 0.5, 0], scale: [0.6, 0.1, 0.6] }, // Seat
            { type: 'cube', pos: [0, 1.5, -0.5], scale: [0.6, 1.0, 0.1] }, // Back
            { type: 'cube', pos: [-0.6, 0.8, 0], scale: [0.1, 0.4, 0.6] }, // L Arm
            { type: 'cube', pos: [0.6, 0.8, 0], scale: [0.1, 0.4, 0.6] } // R Arm
        ]
    }),
    createTable: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 1.0, 0], scale: [1.5, 0.1, 1.0] }, // Top
            // Legs (Using Ring for symmetry? Or manual Group)
            { type: 'cube', pos: [-1.2, 0.5, -0.8], scale: [0.1, 0.5, 0.1] },
            { type: 'cube', pos: [1.2, 0.5, -0.8], scale: [0.1, 0.5, 0.1] },
            { type: 'cube', pos: [-1.2, 0.5, 0.8], scale: [0.1, 0.5, 0.1] },
            { type: 'cube', pos: [1.2, 0.5, 0.8], scale: [0.1, 0.5, 0.1] }
        ]
    })
};
