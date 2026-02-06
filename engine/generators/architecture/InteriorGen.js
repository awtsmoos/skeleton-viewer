
// B"H
import { Builder } from '../Builder.js';
import { FurnitureGen } from './FurnitureGen.js';

export const InteriorGen = {
    createFloorPlan: (width, length, levels) => {
        return Builder.build({
            type: 'array', count: levels, step: { pos: [0, 3.0, 0] },
            item: {
                type: 'group',
                parts: [
                    { type: 'cube', pos: [0, 0, 0], scale: [width, 0.2, length] }, // Floor
                    { type: 'cube', pos: [0, 2.8, 0], scale: [width, 0.2, length] }, // Ceiling
                    // Walls
                    { type: 'cube', pos: [-width/2, 1.5, 0], scale: [0.2, 1.5, length] },
                    { type: 'cube', pos: [width/2, 1.5, 0], scale: [0.2, 1.5, length] },
                    { type: 'cube', pos: [0, 1.5, -length/2], scale: [width, 1.5, 0.2] }
                ]
            }
        });
    }
};
