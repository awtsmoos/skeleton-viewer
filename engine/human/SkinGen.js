// B"H
import { LoftEngine } from '../geometry/LoftEngine.js';
import { Primitives } from '../generators/Primitives.js';
import { Vec3 } from '../math/Vec3.js';

/**
 * SkinGen: The Weaver of the Final Garment.
 */
export const SkinGen = {
    createUnifiedSkin: (skeletonHierarchy, muscleGeometries = null) => {
        const skinParts = [];

        const spinePath = SkinGen.getBonePath(skeletonHierarchy, 'pelvis', 'c1_atlas');
        const armLPath = SkinGen.getBonePath(skeletonHierarchy, 'clavicle_l', 'mc3_l');
        const armRPath = SkinGen.getBonePath(skeletonHierarchy, 'clavicle_r', 'mc3_r');
        const legLPath = SkinGen.getBonePath(skeletonHierarchy, 'ilium_l', 'talus_l');
        const legRPath = SkinGen.getBonePath(skeletonHierarchy, 'ilium_r', 'talus_r');

        const muscleInfluence = 1.2;

        if (spinePath.length > 1) {
             skinParts.push(SkinGen.createLoftForPath(spinePath, (t) => {
                 if (t > 0.8) return 0.065;
                 return (0.16 - Math.abs(t - 0.5) * 0.2) * muscleInfluence;
             }, 24));
        }

        if (armLPath.length > 1) skinParts.push(SkinGen.createLoftForPath(armLPath, (t) => (0.06 - t * 0.04) * muscleInfluence, 12));
        if (armRPath.length > 1) skinParts.push(SkinGen.createLoftForPath(armRPath, (t) => (0.06 - t * 0.04) * muscleInfluence, 12));
        if (legLPath.length > 1) skinParts.push(SkinGen.createLoftForPath(legLPath, (t) => (0.11 - t * 0.07) * muscleInfluence, 16));
        if (legRPath.length > 1) skinParts.push(SkinGen.createLoftForPath(legRPath, (t) => (0.11 - t * 0.07) * muscleInfluence, 16));
        
        if (skinParts.length === 0) return null; // No fallback cube artifacts

        return LoftEngine.weld(skinParts, 0.05);
    },
    
    getBonePath: (hierarchy, startId, endId) => {
        const path = [];
        let current = hierarchy.bones.get(endId);
        let steps = 0;
        while (current && steps < 100) {
            path.push(current.worldPosition);
            if (current.id === startId) break;
            current = hierarchy.bones.get(current.parent);
            steps++;
        }
        return path.reverse();
    },
    
    createLoftForPath: (path, radiusFn, segments) => {
        if (!path || path.length < 2) return null;
        const totalLength = path.reduce((len, p, i) => i === 0 ? 0 : len + Vec3.len(Vec3.sub(p, path[i-1])), 0);
        let traveled = 0;
        const radii = path.map((p, i) => {
            if (i > 0) traveled += Vec3.len(Vec3.sub(p, path[i-1]));
            const t = totalLength > 0 ? traveled / totalLength : 0;
            return radiusFn(t);
        });
        return LoftEngine.loftPath(path, radii, segments);
    },
};
