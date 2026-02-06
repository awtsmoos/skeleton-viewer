
// B"H
import { Builder } from '../Builder.js';
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const RoofGen = {
    createShingleRoof: () => Builder.build({
        type: 'group',
        parts: [
            { type: 'cube', pos: [-1, 1, 0], scale: [1.5, 0.1, 2], rot: [0,0,0.7] }, // Left Slope
            { type: 'cube', pos: [1, 1, 0], scale: [1.5, 0.1, 2], rot: [0,0,-0.7] }, // Right Slope
            // Note: Builder rotation logic is simple Euler.
        ]
    }),
    createDome: () => GeoUtils.transform(Primitives.createSphere(16,16), 0,0,0, 2,2,2)
};
