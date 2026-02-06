// B"H
import { createObject } from '../../types/objects.js';
import { SkeletonGen } from './bio/SkeletonGen.js';
import { MusculatureGen } from './bio/MusculatureGen.js';
import { SkinGen } from './character/SkinGen.js';
import { HairGen } from './character/HairGen.js';
import { BoneHierarchy } from '../human/BoneHierarchy.js';
import { FaceGen } from './character/FaceGen.js';
import { GeoUtils } from './GeoUtils.js';

/**
 * CharacterGen: The Manifestation of the Human Form as a complete, multi-layered entity.
 * This is the new Master Builder, orchestrating all the specialized systems to create Adam Kadmon.
 */
export const CharacterGen = {
    /**
     * Creates a full, rigged, multi-layered humanoid with hyper-realistic detail.
     * @returns {Object} An object containing the separate geometries for skin, bones, muscles, and hair.
     */
    createRiggedHumanoid: (blueprint = {}) => {
        
        // 1. EMANATE SKELETON HIERARCHY
        // This builds the tree and calculates the world position of each bone in the bind pose.
        const skeletonHierarchy = BoneHierarchy.build();

        // 2. FORGE THE GEOMETRY
        // Each of these functions returns a single, merged geometry object { vertices, indices, ... }
        const bonesGeo = SkeletonGen.createFullSkeleton206(skeletonHierarchy);
        const muscleGeo = MusculatureGen.createFullMusculature(skeletonHierarchy);
        const skinGeo = SkinGen.createUnifiedSkin(skeletonHierarchy);
        const hairGeo = HairGen.createStrandHair();
        const beardGeo = HairGen.createBeard();
        
        // The final result is a collection of geometries, ready to be cached by the Renderer.
        return {
            skin: skinGeo,
            bones: bonesGeo,
            muscles: muscleGeo,
            hair: GeoUtils.merge([hairGeo, beardGeo]) // Combine hair for now
        };
    }
};