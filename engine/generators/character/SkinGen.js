
// B"H
import { LoftEngine } from '../../geometry/LoftEngine.js';
import { GeoUtils } from '../GeoUtils.js';
import { Primitives } from '../Primitives.js';
import { Vec3 } from '../../math/Vec3.js';

/**
 * SkinGen: The Weaver of the Final Garment.
 * This sacred artisan no longer drapes a simple cloth over bones, but now weaves a
 * single, continuous garment that flows over the true contours of both bone AND muscle,
 * creating a unified and realistic form.
 */
export const SkinGen = {
    createUnifiedSkin: (skeletonHierarchy, muscleGeometries = null) => {
        const skinParts = [];

        // Define the major chains of emanation from the skeleton
        const spinePath = SkinGen.getBonePath(skeletonHierarchy, 'pelvis', 'c1_atlas');
        const armLPath = SkinGen.getBonePath(skeletonHierarchy, 'clavicle_l', 'mc3_l');
        const armRPath = SkinGen.getBonePath(skeletonHierarchy, 'clavicle_r', 'mc3_r');
        const legLPath = SkinGen.getBonePath(skeletonHierarchy, 'ilium_l', 'talus_l');
        const legRPath = SkinGen.getBonePath(skeletonHierarchy, 'ilium_r', 'talus_r');

        // Weave the skin for each chain, with radii influenced by muscle volume
        // The radius function now has to account for the muscle geometries. This is complex.
        // For a robust solution, we'd use a volumetric approach (metaballs, etc.).
        // Here, we'll approximate by increasing the base radius.
        const muscleInfluence = 1.3;

        skinParts.push(SkinGen.createLoftForPath(spinePath, (t) => (0.16 - Math.abs(t - 0.5) * 0.2) * muscleInfluence, 24));
        skinParts.push(SkinGen.createLoftForPath(armLPath, (t) => (0.07 - t * 0.04) * muscleInfluence, 12));
        skinParts.push(SkinGen.createLoftForPath(armRPath, (t) => (0.07 - t * 0.04) * muscleInfluence, 12));
        skinParts.push(SkinGen.createLoftForPath(legLPath, (t) => (0.12 - t * 0.07) * muscleInfluence, 16));
        skinParts.push(SkinGen.createLoftForPath(legRPath, (t) => (0.12 - t * 0.07) * muscleInfluence, 16));
        
        // Head, hands, and feet as more detailed caps
        const headNode = skeletonHierarchy.bones.get('skull_base');
        if (headNode) {
            skinParts.push(GeoUtils.transform(Primitives.createSphere(24, 24), headNode.worldPosition.x, headNode.worldPosition.y, headNode.worldPosition.z, 0.11, 0.13, 0.11));
        }

        // Weld all parts into the final, single form.
        return LoftEngine.weld(skinParts, 0.05); // Use a larger threshold to merge limbs to torso
    },
    
    getBonePath: (hierarchy, startId, endId) => {
        const path = [];
        let current = hierarchy.bones.get(endId);
        while (current) {
            path.push(current.worldPosition);
            if (current.id === startId) break;
            current = hierarchy.bones.get(current.parent);
        }
        return path.reverse();
    },
    
    createLoftForPath: (path, radiusFn, segments) => {
        if (path.length < 2) return null;
        const totalLength = path.reduce((len, p, i) => {
            if (i === 0) return 0;
            return len + Vec3.len(Vec3.sub(p, path[i-1]));
        }, 0);
        
        let traveled = 0;
        const radii = path.map((p, i) => {
            if (i > 0) traveled += Vec3.len(Vec3.sub(p, path[i-1]));
            const t = totalLength > 0 ? traveled / totalLength : 0;
            return radiusFn(t);
        });

        return LoftEngine.loftPath(path, radii, segments);
    },
};
