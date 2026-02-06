// B"H
import { GeoUtils } from '../GeoUtils.js';
import { Primitives } from '../Primitives.js';
import { BoneGeometry } from '../../human/BoneGeometry.js';
import { Mat4 } from '../../math/Mat4.js';

/**
 * SkeletonGen: The Master Weaver of the 206.
 * Manifests the complete skeletal Tree of Life.
 */
export const SkeletonGen = {
    createFullSkeleton206: (skeletonHierarchy) => {
        const skullParts = [];
        const bodyParts = [];

        skeletonHierarchy.roots.forEach(rootBone => {
            SkeletonGen.traverseAndBuild(rootBone, new Mat4(), skullParts, bodyParts);
        });
        
        console.log(`B"H - Restored Skeleton: ${skullParts.length} skull, ${bodyParts.length} body segments.`);
        
        const skullUnified = skullParts.length > 0 ? GeoUtils.merge(skullParts) : null;
        const bodyUnified = bodyParts.length > 0 ? GeoUtils.merge(bodyParts) : null;

        const allGeos = [];
        if (skullUnified) allGeos.push(skullUnified);
        if (bodyUnified) allGeos.push(bodyUnified);

        return allGeos.length > 0 ? GeoUtils.merge(allGeos) : Primitives.createSphere(4,4);
    },

    traverseAndBuild: (boneNode, parentWorldMatrix, skullArray, bodyArray) => {
        if (!boneNode) return;

        const localPos = boneNode.position ? { x: boneNode.position[0], y: boneNode.position[1], z: boneNode.position[2] } : { x: 0, y: 0, z: 0 };
        const localMatrix = new Mat4().translate(localPos);
        
        const worldMatrix = new Mat4();
        worldMatrix.data.set(parentWorldMatrix.data);
        worldMatrix.multiply(localMatrix);

        const structuralChild = boneNode.children.find(c => {
             if (boneNode.type === 'thoracic' && c.type === 'rib') return false;
             if (boneNode.id === 'sternum_manubrium' && c.id.includes('clavicle')) return false;
             return true;
        }) || boneNode.children[0];

        let endpoint = null;
        if (structuralChild && structuralChild.position) {
            endpoint = { x: structuralChild.position[0], y: structuralChild.position[1], z: structuralChild.position[2] };
        } else {
            if (boneNode.length) endpoint = { x: 0, y: -boneNode.length, z: 0 };
            else endpoint = { x: 0, y: -0.02, z: 0 };
        }

        const boneGeo = BoneGeometry.create(boneNode, endpoint);
        const isHead = ['cranial', 'facial', 'cranial_base'].includes(boneNode.type);

        if (boneGeo && boneGeo.vertices && boneGeo.vertices.length > 0) {
            const transformed = SkeletonGen.transformGeometry(boneGeo, worldMatrix);
            if (isHead) skullArray.push(transformed);
            else bodyArray.push(transformed);
        }

        // --- RESTORED JOINTS ---
        if (!boneNode.id.includes('tip')) {
            const jointGeo = BoneGeometry.createJoint(boneNode);
            if (jointGeo) {
                const transformedJoint = SkeletonGen.transformGeometry(jointGeo, worldMatrix);
                if (isHead) skullArray.push(transformedJoint);
                else bodyArray.push(transformedJoint);
            }
        }

        boneNode.children.forEach(child => {
            SkeletonGen.traverseAndBuild(child, worldMatrix, skullArray, bodyArray);
        });
    },

    transformGeometry: (geo, matrix) => {
        const transformed = {
            vertices: new Float32Array(geo.vertices.length),
            normals: new Float32Array(geo.normals.length),
            indices: geo.indices
        };
        const m = matrix.data;
        for (let i = 0; i < geo.vertices.length; i += 3) {
            const x = geo.vertices[i], y = geo.vertices[i+1], z = geo.vertices[i+2];
            transformed.vertices[i]   = m[0]*x + m[4]*y + m[8]*z + m[12];
            transformed.vertices[i+1] = m[1]*x + m[5]*y + m[9]*z + m[13];
            transformed.vertices[i+2] = m[2]*x + m[6]*y + m[10]*z + m[14];
            if (geo.normals) {
                const nx = geo.normals[i], ny = geo.normals[i+1], nz = geo.normals[i+2];
                transformed.normals[i]   = m[0]*nx + m[4]*ny + m[8]*nz;
                transformed.normals[i+1] = m[1]*nx + m[5]*ny + m[9]*nz;
                transformed.normals[i+2] = m[2]*nx + m[6]*ny + m[10]*nz;
            }
        }
        return transformed;
    }
};
