
// B"H
/**
 * SkinningSystem: The Divine Flesh Binding.
 * This system performs the sacred act of binding each vertex of the skin to the bones of the skeleton.
 * It calculates influence weights, determining how the flesh will stretch and move in harmony
 * with the underlying structure, creating a single, unified, living vessel.
 */

import { Vec3 } from '../math/Vec3.js';

export const SkinningSystem = {
    MAX_BONES_PER_VERTEX: 4,

    /**
     * Calculates skinning weights for a skin mesh based on a skeleton hierarchy.
     * @param {Object} skinGeo - The geometry of the skin mesh { vertices, ... }.
     * @param {Object} skeletonHierarchy - The built skeleton hierarchy with world positions.
     * @returns {Object} { boneIndices, boneWeights } - Attributes to be added to the skin mesh.
     */
    calculateWeights: (skinGeo, skeletonHierarchy) => {
        const vertices = skinGeo.vertices;
        const vertexCount = vertices.length / 3;
        const boneIndices = new Float32Array(vertexCount * SkinningSystem.MAX_BONES_PER_VERTEX);
        const boneWeights = new Float32Array(vertexCount * SkinningSystem.MAX_BONES_PER_VERTEX);

        const bones = Array.from(skeletonHierarchy.bones.values());

        for (let i = 0; i < vertexCount; i++) {
            const vertPos = { x: vertices[i*3], y: vertices[i*3+1], z: vertices[i*3+2] };
            
            const influences = [];
            bones.forEach((bone, boneIndex) => {
                const dist = Vec3.len(Vec3.sub(vertPos, bone.worldPosition));
                
                // Influence radius is proportional to the bone's "size" or length
                const influenceRadius = (bone.length || 0.1) * 2.5 + (bone.radius || 0.05);
                
                if (dist < influenceRadius) {
                    // Inverse distance weighting, squared for stronger falloff
                    const weight = 1.0 / (dist * dist + 0.001);
                    influences.push({ index: boneIndex, weight: weight });
                }
            });

            // Sort by weight and take the top N
            influences.sort((a, b) => b.weight - a.weight);
            const topInfluences = influences.slice(0, SkinningSystem.MAX_BONES_PER_VERTEX);

            // Normalize weights
            let totalWeight = topInfluences.reduce((sum, inf) => sum + inf.weight, 0);
            if (totalWeight === 0 && topInfluences.length > 0) totalWeight = 1.0;

            for (let j = 0; j < SkinningSystem.MAX_BONES_PER_VERTEX; j++) {
                const v_idx = i * 4 + j;
                if (j < topInfluences.length) {
                    boneIndices[v_idx] = topInfluences[j].index;
                    boneWeights[v_idx] = topInfluences[j].weight / totalWeight;
                } else {
                    boneIndices[v_idx] = 0;
                    boneWeights[v_idx] = 0;
                }
            }
        }
        
        return { boneIndices, boneWeights };
    }
};
