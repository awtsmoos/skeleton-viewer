
// B"H
/**
 * BoneHierarchy: The Divine Geometer of Life's Tree.
 * This sacred system takes the flat list of all bones and, by reading the parent-child relationships
 * inscribed within them, constructs the true, interconnected tree of the skeleton. It breathes life
 * into the static blueprint by calculating the absolute world position of each bone,
 * establishing the foundational "bind pose" from which all movement will spring.
 */

import { SkeletonData } from './SkeletonData.js';
import { Vec3 } from '../math/Vec3.js';

export const BoneHierarchy = {
    /**
     * Builds the complete, hierarchical tree of bones and calculates their world positions.
     * This is the act of emanation, where each bone finds its place relative to its source.
     * @returns {Object} An object containing the map of all bones and the root bones of the hierarchy.
     */
    build: () => {
        const bones = SkeletonData.getAllBones();
        const boneMap = new Map();
        const rootBones = [];

        // First pass: Create a node for every bone in the map.
        bones.forEach(bone => {
            boneMap.set(bone.id, {
                ...bone,
                children: [],
                worldPosition: { x: 0, y: 0, z: 0 }
            });
        });

        // Second pass: Weave the hierarchy by connecting children to their parents.
        boneMap.forEach(node => {
            if (node.parent && boneMap.has(node.parent)) {
                const parent = boneMap.get(node.parent);
                parent.children.push(node);
            } else {
                // If a bone has no parent, it is a root of the world.
                rootBones.push(node);
            }
        });

        // Third pass: Traverse the tree to calculate the absolute world position of each bone.
        const calculateWorldPos = (node, parentPos) => {
            // A bone's position is an offset from its parent's position.
            const localPos = Array.isArray(node.position) 
                ? { x: node.position[0], y: node.position[1], z: node.position[2] }
                : { x: 0, y: 0, z: 0 };
            
            node.worldPosition = Vec3.add(parentPos, localPos);

            // Continue the emanation down to the children.
            node.children.forEach(child => {
                calculateWorldPos(child, node.worldPosition);
            });
        };
        
        // The entire skeleton emanates from the Pelvis, the foundation.
        rootBones.forEach(root => calculateWorldPos(root, root.position || { x: 0, y: 0, z: 0 }));

        return {
            bones: boneMap,
            roots: rootBones
        };
    }
};
