
// B"H
import { GeoUtils } from '../GeoUtils.js';
import { Primitives } from '../Primitives.js';
import { LoftEngine } from '../../geometry/LoftEngine.js';
import { MuscleLoader } from '../../human/MuscleLoader.js';
import { Vec3 } from '../../math/Vec3.js';

/**
 * MusculatureGen: The Divine Weaver of Flesh.
 * This artisan forges the engines of action, the muscles, stretching them between their
 * true origin and insertion points on the sacred skeleton.
 */
export const MusculatureGen = {
    createFullMusculature: (skeletonHierarchy) => {
        const allMuscles = [];
        const muscleData = MuscleLoader.getVisibleMuscles();
        
        muscleData.forEach(muscleInfo => {
            // Find origin and insertion points in the 3D skeleton
            const originBone = skeletonHierarchy.bones.get(muscleInfo.origin?.[0] || muscleInfo.origin);
            const insertionBone = skeletonHierarchy.bones.get(muscleInfo.insertion);

            if (originBone && insertionBone) {
                const start = originBone.worldPosition;
                const end = insertionBone.worldPosition;
                const muscleGeo = MusculatureGen.createMuscleBelly(start, end, muscleInfo.flexStrength || 0.1);
                allMuscles.push(muscleGeo);
            }
        });

        return GeoUtils.merge(allMuscles);
    },

    /**
     * Creates a single muscle belly between two world-space points.
     */
    createMuscleBelly: (start, end, radius) => {
        const mid = Vec3.lerp(start, end, 0.5);
        // Add a slight curve to the muscle belly
        mid.y += (start.y - end.y) * 0.1 + radius * 0.2;

        const points = [start, mid, end];
        const radii = [radius * 0.3, radius, radius * 0.3];
        return LoftEngine.loftPath(points, radii, 8);
    },
};
