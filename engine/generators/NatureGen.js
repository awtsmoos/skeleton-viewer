// B"H
import { Primitives } from './Primitives.js';
import { GeoUtils } from './GeoUtils.js';

/**
 * NatureGen: The Breath of the Forest.
 * Creating hyper-realistic Oaks and Willows via recursive branching.
 */
export const NatureGen = {
    createHyperTree: (type = 'oak') => {
        const branchGeos = [];
        const leafGeos = [];

        /**
         * The Recursive Word of Growth.
         */
        const grow = (x, y, z, vx, vy, vz, thickness, length, depth) => {
            if (depth <= 0 || thickness < 0.01) return;

            // Create segment (organic cylinder via transformed cube)
            const segment = GeoUtils.transform(Primitives.createCube(), x + vx*length/2, y + vy*length/2, z + vz*length/2, thickness, length/2, thickness);
            
            // Apply gnarled twisting
            const twistX = (Math.random() - 0.5) * 0.5;
            const twistZ = (Math.random() - 0.5) * 0.5;
            
            branchGeos.push(segment);

            // New positions
            const nx = x + vx * length;
            const ny = y + vy * length;
            const nz = z + vz * length;

            // Branching logic
            const numBranches = type === 'oak' ? (Math.random() > 0.7 ? 3 : 2) : 2;
            const nextLength = length * (0.7 + Math.random() * 0.2);
            const nextThickness = thickness * 0.7;

            for (let i = 0; i < numBranches; i++) {
                let nvx = vx + (Math.random() - 0.5) * 0.8;
                let nvy = vy + (Math.random() - 0.2) * 0.5;
                let nvz = vz + (Math.random() - 0.5) * 0.8;
                
                // Willow drooping logic
                if (type === 'willow' && depth < 5) {
                    nvy = -Math.abs(nvy) - 0.2; // Force downward
                }

                // Normalize direction
                const mag = Math.sqrt(nvx*nvx + nvy*nvy + nvz*nvz);
                grow(nx, ny, nz, nvx/mag, nvy/mag, nvz/mag, nextThickness, nextLength, depth - 1);
            }

            // Leaves
            if (depth < 3) {
                const leaf = GeoUtils.transform(Primitives.createSphere(4, 4), nx, ny, nz, 0.05, 0.05, 0.05);
                leafGeos.push(leaf);
            }
        };

        // Start the growth
        if (type === 'oak') {
            grow(0, 0, 0, 0, 1, 0, 0.2, 1.5, 8);
        } else {
            grow(0, 0, 0, 0, 1, 0, 0.15, 1.2, 10);
        }

        return GeoUtils.merge([...branchGeos, ...leafGeos]);
    },

    createOak: () => NatureGen.createHyperTree('oak'),
    createWillow: () => NatureGen.createHyperTree('willow')
};