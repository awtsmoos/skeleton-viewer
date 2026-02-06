
// B"H
import { Builder } from '../Builder.js';

export const VascularGen = {
    // This previously traversed a skeleton. 
    // Now we will just create a generic vein mesh for testing.
    createSystem: (skeletonRig) => {
        // We can't easily traverse the rig here to build geometry 
        // without access to the runtime scene graph transforms.
        // For static mesh generation:
        return Builder.build({
            type: 'array', count: 10, step: { pos: [0, 0.5, 0], rot: [0, 0.5, 0] },
            item: { type: 'cube', scale: [0.05, 0.5, 0.05] }
        });
    }
};
