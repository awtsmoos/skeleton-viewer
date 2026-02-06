// B"H
/**
 * IKSystem: Inverse Kinematics for Natural Movement
 * Handles reaching, walking, and other goal-oriented motion
 */

import { Vec3 } from '../math/Vec3.js';
import { JointSystem } from './JointSystem.js';

export const IKSystem = {
    /**
     * Solve 2-bone IK (arm or leg)
     * @param {Object} shoulder - Root joint (shoulder/hip)
     * @param {Object} elbow - Middle joint (elbow/knee)
     * @param {Object} wrist - End joint (wrist/ankle)
     * @param {Object} target - Target position {x, y, z}
     * @param {Object} pole - Pole vector for bend direction {x, y, z}
     */
    solveTwoBoneIK: (shoulder, elbow, wrist, target, pole = null) => {
        const upperLen = Vec3.len(Vec3.sub(elbow.localPosition, { x: 0, y: 0, z: 0 })) || 0.3;
        const lowerLen = Vec3.len(Vec3.sub(wrist.localPosition, { x: 0, y: 0, z: 0 })) || 0.28;
        
        const shoulderPos = shoulder.worldPosition || { x: 0, y: 0, z: 0 };
        const toTarget = Vec3.sub(target, shoulderPos);
        const targetDist = Vec3.len(toTarget);

        // Clamp target to reachable distance
        const maxReach = upperLen + lowerLen - 0.01;
        const minReach = Math.abs(upperLen - lowerLen) + 0.01;
        const clampedDist = Math.max(minReach, Math.min(maxReach, targetDist));

        // Calculate elbow angle using law of cosines
        const cosElbow = (upperLen * upperLen + lowerLen * lowerLen - clampedDist * clampedDist) 
                        / (2 * upperLen * lowerLen);
        const elbowAngle = Math.acos(Math.max(-1, Math.min(1, cosElbow)));

        // Calculate shoulder angle
        const cosShoulder = (upperLen * upperLen + clampedDist * clampedDist - lowerLen * lowerLen)
                          / (2 * upperLen * clampedDist);
        const shoulderAngle = Math.acos(Math.max(-1, Math.min(1, cosShoulder)));

        // Get direction to target
        const dir = Vec3.normalize(toTarget);
        
        // Calculate rotation angles
        const pitch = Math.asin(-dir.y); // Up/down
        const yaw = Math.atan2(dir.x, dir.z); // Left/right

        // Apply rotations with constraints
        const shoulderRot = {
            x: (pitch + shoulderAngle) * 180 / Math.PI,
            y: yaw * 180 / Math.PI,
            z: 0
        };

        const elbowRot = {
            x: (Math.PI - elbowAngle) * 180 / Math.PI,
            y: 0,
            z: 0
        };

        // Apply with constraint clamping
        JointSystem.setJointRotation(shoulder, shoulderRot);
        JointSystem.setJointRotation(elbow, elbowRot);

        return { shoulder: shoulderRot, elbow: elbowRot };
    },

    /**
     * Solve look-at for head/eyes
     */
    solveLookAt: (headJoint, eyeTarget) => {
        if (!headJoint.worldPosition) return { x: 0, y: 0, z: 0 };

        const toTarget = Vec3.sub(eyeTarget, headJoint.worldPosition);
        const dir = Vec3.normalize(toTarget);

        const pitch = Math.asin(-dir.y) * 180 / Math.PI;
        const yaw = Math.atan2(dir.x, dir.z) * 180 / Math.PI;

        // Clamp to natural head movement range
        const rotation = {
            x: Math.max(-30, Math.min(30, pitch)),
            y: Math.max(-70, Math.min(70, yaw)),
            z: 0
        };

        JointSystem.setJointRotation(headJoint, rotation);
        return rotation;
    },

    /**
     * FABRIK (Forward And Backward Reaching IK) for spine
     */
    solveFABRIK: (chain, target, iterations = 10) => {
        if (chain.length < 2) return;

        const positions = chain.map(j => ({ ...j.worldPosition }));
        const lengths = [];
        
        for (let i = 0; i < chain.length - 1; i++) {
            lengths.push(Vec3.len(Vec3.sub(positions[i + 1], positions[i])));
        }

        const rootPos = { ...positions[0] };

        for (let iter = 0; iter < iterations; iter++) {
            // Forward reaching
            positions[chain.length - 1] = { ...target };
            for (let i = chain.length - 2; i >= 0; i--) {
                const dir = Vec3.normalize(Vec3.sub(positions[i], positions[i + 1]));
                positions[i] = Vec3.add(positions[i + 1], Vec3.mul(dir, lengths[i]));
            }

            // Backward reaching
            positions[0] = { ...rootPos };
            for (let i = 1; i < chain.length; i++) {
                const dir = Vec3.normalize(Vec3.sub(positions[i], positions[i - 1]));
                positions[i] = Vec3.add(positions[i - 1], Vec3.mul(dir, lengths[i - 1]));
            }
        }

        // Convert positions back to rotations
        for (let i = 0; i < chain.length - 1; i++) {
            const dir = Vec3.normalize(Vec3.sub(positions[i + 1], positions[i]));
            const rotation = {
                x: Math.asin(-dir.y) * 180 / Math.PI,
                y: Math.atan2(dir.x, dir.z) * 180 / Math.PI,
                z: 0
            };
            JointSystem.setJointRotation(chain[i], rotation);
        }

        return positions;
    },

    /**
     * Foot placement IK for walking
     */
    solveFootPlacement: (legChain, groundHeight = 0) => {
        const ankleJoint = legChain[legChain.length - 1];
        if (!ankleJoint.worldPosition) return;

        // Project ankle to ground
        const footTarget = {
            x: ankleJoint.worldPosition.x,
            y: groundHeight + 0.08, // Ankle height above ground
            z: ankleJoint.worldPosition.z
        };

        // Use 2-bone IK for leg
        if (legChain.length >= 3) {
            IKSystem.solveTwoBoneIK(
                legChain[0], // Hip
                legChain[1], // Knee
                legChain[2], // Ankle
                footTarget,
                { x: 0, y: 0, z: 1 } // Pole vector - knee bends forward
            );
        }
    }
};
