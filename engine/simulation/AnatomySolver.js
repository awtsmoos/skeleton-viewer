
// B"H
import { Vec3 } from '../math/Vec3.js';
import { MuscleLoader } from '../human/MuscleLoader.js';
import { JointSystem } from '../human/JointSystem.js';
import { Mat4 } from '../math/Mat4.js';

/**
 * AnatomySolver: The Lower Brain & Spinal Cord.
 * This is the divine instrument that translates the abstract will of muscle activation into the
 * concrete reality of physical motion. It calculates the PULLING forces, the resulting torques,
 * and solves for the final orientation of each bone in the sacred hierarchy, moment by moment.
 */
export class AnatomySolver {
    constructor() {
        this.muscleData = MuscleLoader.getVisibleMuscles();
    }

    /**
     * Solves the anatomical pose for one frame.
     * @param {Object} skeletonHierarchy - The complete bone hierarchy with world positions.
     * @param {Map<string, number>} muscleActivationState - The map of muscle activations from the AnimationEngine.
     * @param {number} dt - The delta time for this frame's simulation.
     */
    solve(skeletonHierarchy, muscleActivationState, dt) {
        if (!skeletonHierarchy || !muscleActivationState) return;

        const torques = new Map(); // jointId -> {x,y,z} torque vector

        // 1. Calculate Forces and Torques from Muscles
        this.muscleData.forEach(muscle => {
            const activation = muscleActivationState.get(muscle.id) || 0.0;
            if (activation <= 0.001) return;

            const originBone = skeletonHierarchy.bones.get(muscle.origin);
            const insertionBone = skeletonHierarchy.bones.get(muscle.insertion);
            
            if (!originBone || !insertionBone) return;

            const originPos = originBone.worldPosition;
            const insertionPos = insertionBone.worldPosition;
            
            // Muscles can ONLY PULL. The force vector is from insertion to origin.
            const forceDir = Vec3.normalize(Vec3.sub(originPos, insertionPos));
            const forceMagnitude = activation * (muscle.flexStrength || 1.0) * 20.0; // Scaled force
            const force = Vec3.mul(forceDir, forceMagnitude);

            // Apply torque to the joint of the insertion bone.
            // Torque = r x F (cross product of lever arm and force)
            const parentJoint = skeletonHierarchy.bones.get(insertionBone.parent);
            if (!parentJoint) return;

            const jointPos = parentJoint.worldPosition;
            const leverArm = Vec3.sub(insertionPos, jointPos);
            const torque = Vec3.cross(leverArm, force);
            
            const existingTorque = torques.get(parentJoint.id) || {x:0, y:0, z:0};
            torques.set(parentJoint.id, Vec3.add(existingTorque, torque));
        });

        // 2. Apply Torques and Update Rotations (Simplified Rigid Body Dynamics)
        skeletonHierarchy.roots.forEach(root => this.applyPhysics(root, torques, dt));
        
        // 3. Update World Matrices after all rotations are set
        skeletonHierarchy.roots.forEach(root => this.updateWorldMatrices(root, new Mat4()));
    }

    /**
     * Applies physics simulation recursively down the bone chain.
     */
    applyPhysics(bone, torques, dt) {
        const torque = torques.get(bone.id);
        if (torque) {
            // I = moment of inertia (approximated)
            const I = 0.1; 
            // Angular acceleration (alpha) = Torque / I
            const angularAcc = Vec3.mul(torque, 1.0 / I);
            
            // Integrate to get angular velocity (omega)
            if (!bone.angularVelocity) bone.angularVelocity = {x:0,y:0,z:0};
            bone.angularVelocity = Vec3.add(bone.angularVelocity, Vec3.mul(angularAcc, dt));

            // Apply damping
            bone.angularVelocity = Vec3.mul(bone.angularVelocity, 0.95);

            // Integrate to get new rotation
            const deltaRot = Vec3.mul(bone.angularVelocity, dt);
            
            // Add to existing rotation
            if (!bone.transform) bone.transform = { rotation: {x:0,y:0,z:0} };
            bone.transform.rotation = Vec3.add(bone.transform.rotation, deltaRot);
            
            // Clamp rotation based on JointSystem constraints
            bone.transform.rotation = JointSystem.setJointRotation(bone, bone.transform.rotation);
        }

        bone.children.forEach(child => this.applyPhysics(child, torques, dt));
    }

    /**
     * Recursively updates the world matrices for skinning after pose is solved.
     */
    updateWorldMatrices(bone, parentWorldMatrix) {
        const localMatrix = new Mat4()
            .translate(bone.position || {x:0,y:0,z:0})
            .rotate(bone.transform.rotation.x, [1,0,0])
            .rotate(bone.transform.rotation.y, [0,1,0])
            .rotate(bone.transform.rotation.z, [0,0,1]);
            
        const worldMatrix = new Mat4();
        worldMatrix.data.set(parentWorldMatrix.data);
        worldMatrix.multiply(localMatrix);
        
        bone.worldMatrix = worldMatrix; // Store for the skinning shader

        bone.children.forEach(child => this.updateWorldMatrices(child, worldMatrix));
    }
}
