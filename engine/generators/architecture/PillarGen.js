
// B"H
import { Builder } from '../Builder.js';

export const PillarGen = {
    createGreekPillar: () => Builder.build({
        type: 'stack',
        count: 3,
        step: { pos: [0, 2, 0] }, // Just explicit parts is easier for non-uniform
        // Actually, let's use Group for mixed parts
        type: 'group',
        parts: [
            { type: 'cube', pos: [0, 0, 0], scale: [0.6, 0.2, 0.6] }, // Base
            { type: 'cube', pos: [0, 2, 0], scale: [0.4, 2.0, 0.4] }, // Shaft
            { type: 'cube', pos: [0, 4.1, 0], scale: [0.7, 0.15, 0.7] } // Cap
        ]
    }),
    createHexPillar: () => Builder.build({
        type: 'cube', pos: [0, 2, 0], scale: [0.5, 2, 0.5] // Hexagon via texture/shader or low poly cyl
    })
};
