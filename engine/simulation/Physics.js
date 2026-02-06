// B"H
import { ParticleSystem } from '../particles/ParticleSystem.js';
import { GlobalAtmosphere } from './Atmosphere.js';
import { Vec3 } from '../math/Vec3.js';

export class PhysicsEngine {
    constructor() {
        this.gravity = { x: 0, y: -9.8, z: 0 };
        this.drag = 0.99;
    }

    update(scene, dt) {
        if (!scene || isNaN(dt)) return;
        
        const newObjects = [];
        ParticleSystem.update(scene, dt, newObjects);

        scene.objects.forEach(obj => {
            if (!obj) return;

            // Validate Transforms
            this.validateTransform(obj);

            // Rigid Body Integration
            if (obj.components && obj.components.physics && !obj.components.physics.isStatic) {
                this.integrate(obj, dt);
                this.collideGround(obj);
            }
            
            // Fluid Emitters
            this.processEmittersRecursively(obj, newObjects);
            
            // --- ATMOSPHERIC INTERACTIONS ---
            // Use standard helper to get position regardless of structure
            const pos = obj.transform ? obj.transform.position : obj.position;
            if (!pos) return;
            
            // 1. HEAT SOURCE
            if (obj.components && obj.components.heatEmitter && obj.components.heatEmitter.active) {
                // Check if wind blows it out!
                const localAir = GlobalAtmosphere.getAt(pos);
                const windSpeed = Math.sqrt(localAir.velocity.x**2 + localAir.velocity.y**2 + localAir.velocity.z**2);
                
                if (windSpeed > 2.0 && obj.type === 'item_candle') {
                     obj.components.heatEmitter.active = false;
                     obj.material.emissive = 0.0; // Dim light
                } else {
                     GlobalAtmosphere.injectHeat(pos, obj.components.heatEmitter.temperature * dt);
                     // Flicker logic
                     if (obj.material) obj.material.emissive = 1.0 + Math.sin(Date.now() * 0.02) * 0.2;
                }
            }
            
            // 2. WIND SOURCE (Fan, Mouth)
            if (obj.components && obj.components.windEmitter && obj.components.windEmitter.active) {
                const rot = obj.transform ? obj.transform.rotation : {x:0, y:0, z:0};
                const rad = rot.y; 
                const dir = { x: Math.sin(rad), y: 0, z: Math.cos(rad) }; 
                const strength = obj.components.windEmitter.strength * dt;
                
                GlobalAtmosphere.injectWind(pos, {
                    x: dir.x * strength,
                    y: dir.y * strength,
                    z: dir.z * strength
                }, obj.components.windEmitter.radius);
            }
            
            // 3. CHARACTER BLOWING STATE
            if (obj.components && obj.components.interaction && obj.components.interaction.isBlowing) {
                 if (!obj.components.windEmitter) {
                     obj.components.windEmitter = { active: true, strength: 10.0, radius: 1.0 };
                 } else {
                     obj.components.windEmitter.active = true;
                 }
            } else if (obj.components && obj.components.interaction && !obj.components.interaction.isBlowing && obj.components.windEmitter && obj.type === 'human_rigged') {
                 obj.components.windEmitter.active = false;
            }

            // 4. EXPLOSION FX TRIGGER
            if (obj.components && obj.components.logic && obj.components.logic.explodeNextTick) {
                ParticleSystem.spawnHebrewBurst(pos, 20, newObjects);
                if (obj.components.lifecycle) obj.components.lifecycle.age = 9999; // Destroy self
            }
        });

        if (newObjects.length > 0) scene.objects.push(...newObjects);
        scene.objects = scene.objects.filter(o => !o.components || !o.components.lifecycle || o.components.lifecycle.age < 100);
    }

    validateTransform(obj) {
        // Handle both structures safely
        const target = obj.transform || obj;
        const pos = target.position;
        const rot = target.rotation || {x:0, y:0, z:0};
        const scl = target.scale || {x:1, y:1, z:1};

        if (pos) {
            ['x','y','z'].forEach(axis => {
                if (isNaN(pos[axis])) pos[axis] = 0;
            });
        }
        ['x','y','z'].forEach(axis => {
            if (isNaN(rot[axis])) rot[axis] = 0;
            if (isNaN(scl[axis])) scl[axis] = 1;
        });
    }

    processEmittersRecursively(obj, newObjects) {
        if (obj.components && obj.components.fluidEmitter && obj.components.fluidEmitter.active) {
            ParticleSystem.spawnFromEmitter(obj, newObjects);
        }
        if (obj.children) {
            obj.children.forEach(c => this.processEmittersRecursively(c, newObjects));
        }
    }

    integrate(obj, dt) {
        const phys = obj.components.physics;
        if (!phys.velocity) phys.velocity = { x: 0, y: 0, z: 0 };
        
        const target = obj.transform || obj;
        if (!target.position) return;

        // 1. GRAVITY
        const acc = { ...this.gravity };
        
        // 2. ATMOSPHERIC FORCES (WIND)
        const air = GlobalAtmosphere.getAt(target.position);
        
        // Aerodynamic Drag/Lift Approximation
        const relX = air.velocity.x - phys.velocity.x;
        const relY = air.velocity.y - phys.velocity.y;
        const relZ = air.velocity.z - phys.velocity.z;
        
        let aeroFactor = 0.1; 
        if (obj.type.includes('particle')) aeroFactor = 2.0;
        if (obj.type.includes('cloth')) aeroFactor = 1.0;
        
        acc.x += relX * aeroFactor;
        acc.y += relY * aeroFactor;
        acc.z += relZ * aeroFactor;
        
        // 3. EULER INTEGRATION
        if (isNaN(acc.x)) acc.x = 0;
        if (isNaN(acc.y)) acc.y = 0;
        if (isNaN(acc.z)) acc.z = 0;

        phys.velocity.x += acc.x * dt;
        phys.velocity.y += acc.y * dt;
        phys.velocity.z += acc.z * dt;
        
        phys.velocity.x *= this.drag;
        phys.velocity.y *= this.drag;
        phys.velocity.z *= this.drag;
        
        target.position.x += phys.velocity.x * dt;
        target.position.y += phys.velocity.y * dt;
        target.position.z += phys.velocity.z * dt;
        
        // Tumble
        if (target.rotation) {
            target.rotation.x += phys.velocity.z * dt * 0.1;
            target.rotation.z -= phys.velocity.x * dt * 0.1;
        }
    }

    collideGround(obj) {
        const target = obj.transform || obj;
        if (target.position && target.position.y < 0) {
            target.position.y = 0;
            if (obj.components.physics.velocity) {
                obj.components.physics.velocity.y *= -0.5; 
                obj.components.physics.velocity.x *= 0.8;  
                obj.components.physics.velocity.z *= 0.8;
            }
        }
    }
}