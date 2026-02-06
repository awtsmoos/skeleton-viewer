
// B"H
import { Vec3 } from '../math/Vec3.js';
import { Mat4 } from '../math/Mat4.js';

/**
 * JointSystem: The Divine Articulations of the Vessel.
 * This system holds the sacred laws of motion, defining how each bone may turn and pivot.
 * It is the source of all natural movement, constraining the infinite potential of rotation
 * into the beautiful, functional forms of life.
 */
export const JointSystem = {
    /**
     * Defines the types of joints and their inherent constraints.
     */
    jointTypes: {
        'ball_socket': { dof: 3, constraints: { x: [-90, 90], y: [-180, 180], z: [-90, 90] } },
        'hinge': { dof: 1, axis: 'x', constraints: { x: [0, 150], y: [0, 0], z: [0, 0] } },
        'pivot': { dof: 1, axis: 'y', constraints: { x: [0, 0], y: [-90, 90], z: [0, 0] } },
        'saddle': { dof: 2, constraints: { x: [-35, 35], y: [0, 0], z: [-35, 35] } },
        'gliding': { dof: 2, constraints: { x: [-10, 10], y: [0,0], z: [-10, 10] } },
        'fixed': { dof: 0, constraints: { x: [0, 0], y: [0, 0], z: [0, 0] } }
    },

    /**
     * Applies a rotation to a joint, respecting its sacred constraints.
     * @param {Object} joint - The joint object from the hierarchy.
     * @param {Object} rotation - The desired rotation {x, y, z} in degrees.
     * @returns {Object} The actual, clamped rotation that was applied.
     */
    setJointRotation: (joint, rotation) => {
        const type = joint.jointType || 'fixed';
        const definition = JointSystem.jointTypes[type] || JointSystem.jointTypes.fixed;
        const constraints = definition.constraints;
        
        const clamped = { x: 0, y: 0, z: 0 };
        
        clamped.x = Math.max(constraints.x[0], Math.min(constraints.x[1], rotation.x || 0));
        clamped.y = Math.max(constraints.y[0], Math.min(constraints.y[1], rotation.y || 0));
        clamped.z = Math.max(constraints.z[0], Math.min(constraints.z[1], rotation.z || 0));
        
        // This is where the actual transform of the bone object in the scene would be updated.
        // For now, we return the clamped value for the AnimationEngine to use.
        return clamped;
    },
};
