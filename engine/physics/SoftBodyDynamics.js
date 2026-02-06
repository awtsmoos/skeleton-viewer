// B"H
import { Vec3 } from '../math/Vec3.js';

export class SoftBodyDynamics {
    constructor() {
        this.prevPositions = new Map(); // id -> {x,y,z}
        this.prevVelocities = new Map(); // id -> {x,y,z}
    }

    update(scene, dt) {
        if (dt === 0) return;

        scene.objects.forEach(obj => {
            // 1. Calculate World Position (Approximation)
            // In a real engine we use the World Matrix. 
            // Here we trust transform.position unless parented.
            // If parented (interaction.heldBy), we must find parent pos.
            
            let currentPos = { ...obj.transform.position };
            
            if (obj.components.interaction && obj.components.interaction.heldBy) {
                const parent = scene.objects.find(p => p.id === obj.components.interaction.heldBy);
                if (parent) {
                    // Simple offset logic for demo
                    currentPos = Vec3.add(parent.transform.position, obj.transform.position);
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
            // We inject these directly into the object so Renderer can bind uniforms
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
