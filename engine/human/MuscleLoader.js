// B"H
/**
 * MuscleLoader: The Scribe of Flesh.
 * This archivist gathers the sacred blueprints of the musculature, the engines of action.
 * It understands the deep connections between muscle and bone, the origin and insertion of power.
 */

import torsoMuscles from '../../data/muscles/torso.js';
import limbMuscles from '../../data/muscles/limbs.js';
import faceMuscles from '../../data/muscles/face.js';

export const MuscleLoader = {
    /**
     * Loads and merges all muscle data from the new JS modules.
     */
    getVisibleMuscles: () => {
        const allMuscles = [];
        
        // Helper to add region info
        const addMuscles = (data, regionName) => {
            if (data && data.muscles) {
                data.muscles.forEach(m => {
                    allMuscles.push({ ...m, region: regionName });
                });
            }
        };

        addMuscles(torsoMuscles, 'torso');
        addMuscles(limbMuscles, 'limbs');
        addMuscles(faceMuscles, 'face');
        
        return allMuscles;
    },

    /**
     * Gets muscles attached to a specific bone ID, crucial for realistic generation.
     */
    getMusclesForBone: (boneId) => {
        const allMuscles = MuscleLoader.getVisibleMuscles();
        return allMuscles.filter(m => {
            const origins = Array.isArray(m.origin) ? m.origin : [m.origin];
            const insertions = Array.isArray(m.insertion) ? m.insertion : [m.insertion];
            return origins.includes(boneId) || insertions.includes(boneId);
        });
    },

    /**
     * Gets muscles by their defined action.
     */
    getMusclesByAction: (action) => {
        const allMuscles = MuscleLoader.getVisibleMuscles();
        return allMuscles.filter(m => m.action === action);
    }
};
