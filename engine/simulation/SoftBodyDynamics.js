// B"H
import { Vec3 } from '../math/Vec3.js';

export class SoftBodyDynamics {
    constructor() {
        this.prevPositions = new Map(); // id -> {x,y,z}
        this.prevVelocities = new Map(); // id -> {x,y,z}
    }

    update(scene, dt) {
        if (!scene || dt === 0) return;

        scene.objects.forEach(obj => {
            if (!obj) return;

            // 1. Calculate World Position (Approximation)
            // Handle both structural manifestations safely
            const targetTransform = obj.transform || obj;
            if (!targetTransform.position) return;

            let currentPos = { ...targetTransform.position };
            
            if (obj.components && obj.components.interaction && obj.components.interaction.heldBy) {
                const parent = scene.objects.find(p => p.id === obj.components.interaction.heldBy);
                if (parent) {
                    const parentTransform = parent.transform || parent;
                    if (parentTransform.position) {
                        currentPos = Vec3.add(parentTransform.position, targetTransform.position);
                    }
                }
            }

            // 2. Get Previous
            const prevPos = this.prevPositions.get(obj.id) || currentPos;
            
            // 3. Calc Velocity
            const velocity = Vec3.mul(Vec3.sub(currentPos, prevPos), 1.0/dt);
            
            // 4. Calc Acceleration
            const prevVel = this.prevVelocities.get(obj.id) || velocity;
            const acceleration = Vec3.mul(Vec3.sub(velocity, prevVel), 1.0/dt);

            // 5. Store in Component for Renderer
            if (!obj.components) obj.components = {};
            if (!obj.components.physics) obj.components.physics = {};
            obj.components.physics.calculatedVelocity = velocity;
            obj.components.physics.calculatedAcceleration = acceleration;

            // 6. Update History
            this.prevPositions.set(obj.id, currentPos);
            this.prevVelocities.set(obj.id, velocity);
        });
    }
}

export const GlobalSoftBody = new SoftBodyDynamics();