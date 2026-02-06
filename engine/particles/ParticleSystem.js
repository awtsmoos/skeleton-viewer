// B"H
import { createObject } from '../../types/objects.js';
import { Vec3 } from '../math/Vec3.js';

export const ParticleSystem = {
    // Shared accumulation map for fluids
    accumulationMap: new Map(),

    update: (scene, dt, newObjects) => {
        // Robustness: Handle NaN or 0 dt
        if (isNaN(dt) || dt <= 0) return;

        // Iterate all particles
        for(let i=scene.objects.length-1; i>=0; i--) {
            const obj = scene.objects[i];
            
            // 1. Water Logic
            if (obj.type === 'particle_water') {
                if (obj.transform.position.y <= 0.1) {
                     const key = `${Math.floor(obj.transform.position.x)},${Math.floor(obj.transform.position.z)}`;
                     const val = (ParticleSystem.accumulationMap.get(key) || 0) + 1;
                     ParticleSystem.accumulationMap.set(key, val);

                     if (val > 10) {
                          const pond = createObject(`pond_${key}_${Date.now()}`, 'water_pond', 'Accumulated Water');
                          pond.transform.position = {x: Math.floor(obj.transform.position.x), y: 0.1, z: Math.floor(obj.transform.position.z)};
                          pond.transform.scale = {x:2, y:1, z:2};
                          newObjects.push(pond);
                          ParticleSystem.accumulationMap.set(key, 0); 
                     }
                     if (!obj.components.lifecycle) obj.components.lifecycle = {};
                     obj.components.lifecycle.age = 999; 
                }
            }
            
            // 2. Letter Logic (Explosion)
            if (obj.type === 'particle_letter') {
                // Spin wildy
                obj.transform.rotation.x += dt * 5;
                obj.transform.rotation.y += dt * 3;
            }
        }
    },

    spawnFromEmitter: (emitterObj, newObjects) => {
         const p = createObject(`drop_${Date.now()}_${Math.random()}`, 'particle_water', 'Water');
         p.material.color = [0, 0.5, 1.0];
         // Safe Copy of Position
         p.transform.position = { 
             x: emitterObj.transform.position.x, 
             y: emitterObj.transform.position.y, 
             z: emitterObj.transform.position.z 
         };
         p.transform.scale = {x:0.1, y:0.1, z:0.1};
         p.components.physics.velocity = {
             x: (Math.random()-0.5),
             y: 0,
             z: 1.0 
         };
         newObjects.push(p);
    },

    // NEW: Spawn Hebrew Letters Explosion
    spawnHebrewBurst: (pos, count, newObjects) => {
        for(let i=0; i<count; i++) {
             const p = createObject(`aleph_${Date.now()}_${i}`, 'hebrew_aleph', 'Aleph Particle');
             p.type = 'particle_letter'; // Tag for specialized logic
             
             p.transform.position = { x: pos.x, y: pos.y, z: pos.z };
             p.transform.scale = {x:0.2, y:0.2, z:0.2};
             p.material.type = 'hebrew_fire'; // Glowing Shader
             
             // Random Velocity Outward
             const theta = Math.random() * Math.PI * 2;
             const phi = Math.random() * Math.PI;
             const speed = 5.0 + Math.random() * 5.0;
             
             p.components.physics.velocity = {
                 x: speed * Math.sin(phi) * Math.cos(theta),
                 y: speed * Math.cos(phi),
                 z: speed * Math.sin(phi) * Math.sin(theta)
             };
             
             p.components.lifecycle.growthRate = -1; // Shrink? Or just fade?
             // Add explicit decay time
             p.components.lifecycle.age = -2.0; // Start negative age? No, let's use standard age and kill at 5
             
             newObjects.push(p);
        }
    }
};